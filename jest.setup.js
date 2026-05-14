import "react-native-gesture-handler/jestSetup";

jest.mock("@expo/vector-icons", () => {
  return {
    Feather: "View",
    Ionicons: "View",
    MaterialIcons: "View",
  };
});

jest.mock("@react-navigation/native", () => {
  return {
    ...jest.requireActual("@react-navigation/native"),
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
    useRoute: () => ({
      name: 'MockScreen',
      params: {},
    }),
  };
});

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
    SafeAreaConsumer: jest.fn().mockImplementation(({ children }) => children(inset)),
    SafeAreaView: jest.fn().mockImplementation(({ children }) => children),
    useSafeAreaInsets: jest.fn().mockReturnValue(inset),
  };
});

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
  getApp: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(() => 'mock-collection'),
  doc: jest.fn(() => 'mock-doc'),
  getDocs: jest.fn(() =>
    Promise.resolve({
      empty: true,
      docs: [],
    })
  ),
  setDoc: jest.fn(() => Promise.resolve()),
  addDoc: jest.fn(() =>
    Promise.resolve({
      id: 'mock-party-id',
    })
  ),
  serverTimestamp: jest.fn(() => 'mock-timestamp'),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));
