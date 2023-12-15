import { useLayoutEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";

const CustomUnmatched = () => {
  const router = useRouter();
  useLayoutEffect(() => {
    router.replace("/");
  }, [router]);

  return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CustomUnmatched;
