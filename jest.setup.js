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
  };
});
