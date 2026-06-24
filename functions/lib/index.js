"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeDraw = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
const db = admin.firestore();
function ensureSet(map, key) {
    if (!map.has(key)) {
        map.set(key, new Set());
    }
    return map.get(key);
}
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
function getValidTargets(giverId, allIds, blockMap, usedReceivers) {
    const blocked = blockMap.get(giverId) ?? new Set();
    return allIds.filter(id => !blocked.has(id) && !usedReceivers.has(id));
}
function backtrack(givers, allIds, blockMap, index, usedReceivers, current) {
    if (index === givers.length) {
        return true;
    }
    const giver = givers[index];
    const candidates = shuffle(getValidTargets(giver, allIds, blockMap, usedReceivers));
    for (const candidate of candidates) {
        current.set(giver, candidate);
        usedReceivers.add(candidate);
        if (backtrack(givers, allIds, blockMap, index + 1, usedReceivers, current)) {
            return true;
        }
        current.delete(giver);
        usedReceivers.delete(candidate);
    }
    return false;
}
function buildBlockMap(participants, restrictions, blockDependentDraw) {
    const blockMap = new Map();
    for (const p of participants) {
        ensureSet(blockMap, p.perfil.id);
    }
    for (const p of participants) {
        ensureSet(blockMap, p.perfil.id).add(p.perfil.id);
    }
    for (const r of restrictions) {
        const a = r.person_a_id;
        const b = r.person_b_id;
        ensureSet(blockMap, a).add(b);
        if (r.direction === "both_ways") {
            ensureSet(blockMap, b).add(a);
        }
    }
    if (blockDependentDraw) {
        const profilesByUser = new Map();
        for (const p of participants) {
            const userId = p.perfil.user_id;
            if (!profilesByUser.has(userId)) {
                profilesByUser.set(userId, []);
            }
            profilesByUser.get(userId).push(p.perfil.id);
        }
        for (const [, profileIds] of profilesByUser) {
            if (profileIds.length <= 1)
                continue;
            for (const giver of profileIds) {
                for (const receiver of profileIds) {
                    if (giver !== receiver) {
                        ensureSet(blockMap, giver).add(receiver);
                    }
                }
            }
        }
    }
    return blockMap;
}
function validatePossibility(participants, blockMap) {
    const allIds = participants.map(p => p.perfil.id);
    for (const id of allIds) {
        const blocked = blockMap.get(id) ?? new Set();
        const possibleTargets = allIds.filter(x => !blocked.has(x));
        if (possibleTargets.length === 0) {
            throw new Error("UNSOLVABLE_GRAPH");
        }
    }
}
function generateDraw(participants, blockMap) {
    const allIds = participants.map(p => p.perfil.id);
    const givers = shuffle(allIds);
    const usedReceivers = new Set();
    const result = new Map();
    const success = backtrack(givers, allIds, blockMap, 0, usedReceivers, result);
    if (!success) {
        throw new Error("UNSOLVABLE_GRAPH");
    }
    const pairs = [];
    for (const [giver, receiver] of result.entries()) {
        pairs.push({
            giver_profile_id: giver,
            receiver_profile_id: receiver
        });
    }
    return pairs;
}
exports.executeDraw = functions.https.onRequest(async (req, res) => {
    // Adiciona suporte a CORS para o frontend
    res.set("Access-Control-Allow-Origin", "*");
    if (req.method === "OPTIONS") {
        res.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        res.set("Access-Control-Allow-Headers", "Content-Type");
        res.set("Access-Control-Max-Age", "3600");
        res.status(204).send("");
        return;
    }
    const { partyId } = req.body;
    if (!partyId) {
        res.status(400).send("partyId é obrigatório");
        return;
    }
    try {
        await db.runTransaction(async (transaction) => {
            // 1. Ler a festa
            const partyRef = db.collection("parties").doc(partyId);
            const partyDoc = await transaction.get(partyRef);
            if (!partyDoc.exists) {
                throw new Error("Party não encontrada");
            }
            const partyData = partyDoc.data();
            if (partyData.status !== "aguardando_sorteio") {
                throw new Error("Party não está pronta para sorteio");
            }
            const blockDependentDraw = partyData.block_dependent_draw || false;
            // 2. Ler PARTY_PARTICIPANT (com status 'confirmado')
            const participantsQuery = db.collection("PARTY_PARTICIPANT")
                .where("perfil.party_id", "==", partyId);
            const participantsSnapshot = await transaction.get(participantsQuery);
            const participants = participantsSnapshot.docs
                .map(doc => doc.data())
                .filter(p => p.perfil?.status === "confirmado");
            if (participants.length < 2) {
                throw new Error("Poucos participantes para sorteio");
            }
            // Limite arquitetural estrito de 100 participantes
            if (participants.length > 100) {
                throw new Error("Limite de 100 participantes excedido");
            }
            // 3. Ler DRAW_RESTRICTION
            const restrictionsQuery = db.collection("DRAW_RESTRICTION")
                .where("party_id", "==", partyId);
            const restrictionsSnapshot = await transaction.get(restrictionsQuery);
            const restrictions = restrictionsSnapshot.docs.map(doc => doc.data());
            // 4. Rodar o algoritmo circular e de bloqueios
            const blockMap = buildBlockMap(participants, restrictions, blockDependentDraw);
            validatePossibility(participants, blockMap);
            const pairs = generateDraw(participants, blockMap);
            // 5. Salvar DRAW_RESULT e mudar o status da festa
            const drawCollection = db.collection("DRAW_RESULT");
            for (const pair of pairs) {
                const newDrawRef = drawCollection.doc();
                transaction.set(newDrawRef, {
                    id: newDrawRef.id,
                    party_id: partyId,
                    giver_profile_id: pair.giver_profile_id,
                    receiver_profile_id: pair.receiver_profile_id,
                    created_at: admin.firestore.FieldValue.serverTimestamp(),
                    updated_at: admin.firestore.FieldValue.serverTimestamp()
                });
            }
            transaction.update(partyRef, {
                status: "sorteio_realizado",
                updated_at: admin.firestore.FieldValue.serverTimestamp()
            });
        });
        res.status(200).json({
            success: true,
            message: "Sorteio realizado com sucesso"
        });
    }
    catch (error) {
        console.error("Erro ao executar sorteio no backend:", error);
        if (error.message === "UNSOLVABLE_GRAPH") {
            res.status(422).send("UNSOLVABLE_GRAPH");
        }
        else {
            res.status(500).send(error.message || "Erro desconhecido");
        }
    }
});
//# sourceMappingURL=index.js.map