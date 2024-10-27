// const SearchButton = () => {
//     const height = Dimensions.get("window").height;
//     const width = Dimensions.get("window").width;

//     const [showSearchModal, setShowSearchModal] = useState(false);
//     const [searchString, setSearchString] = useState("");

//     if (showSearchModal) {
//       return (
//         <>
//           <Modal visible={showSearchModal} transparent animationType="fade">
//             <Pressable
//               className="h-full w-full bg-black/20"
//               onPress={() => setShowSearchModal(false)}
//             >
//               <View
//                 className="absolute flex-row items-center space-x-2 overflow-hidden rounded-full bg-white px-4"
//                 style={{
//                   top: height / 10,
//                   left: width / 25,
//                   right: width / 25,
//                 }}
//               >
//                 <FontAwesome name="search" size={24} color="black" />
//                 <TextInput
//                   className="rounded-lg py-4"
//                   style={{ fontSize: 20 }}
//                   placeholderTextColor={"gray"}
//                   multiline={true}
//                   onChangeText={(text) => setSearchString(text)}
//                   value={searchString}
//                   autoFocus={true}
//                   // placeholder="Search for a place or an event"
//                   placeholder="Search will be ready soon!"
//                 />
//               </View>
//             </Pressable>
//           </Modal>
//           <IconButton
//             onPress={() => {
//               setShowSearchModal(false);
//             }}
//             cn="bg-black"
//           >
//             <FontAwesome name="close" size={24} color="white" />
//           </IconButton>
//         </>
//       );
//     }

//     return (
//       <IconButton
//         onPress={() => {
//           setShowSearchModal(true);
//         }}
//         border={true}
//         cn="bg-white"
//       >
//         <FontAwesome name="search" size={24} color="black" />
//       </IconButton>
//     );
//   };
