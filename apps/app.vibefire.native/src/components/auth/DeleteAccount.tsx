import { useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { FontAwesome6 } from "@expo/vector-icons";

import { trpc } from "!/api/trpc-client";

import { PillTouchableOpacity } from "!/c/button/PillTouchableOpacity";

const DeleteConfirmationModal = (props: {
  showModal: boolean;
  hideModal: () => void;
}) => {
  const { showModal, hideModal } = props;

  const { signOut, userId } = useAuth();

  const utils = trpc.useUtils();

  const deleteAccountMut = trpc.auth.deleteAccount.useMutation();

  return (
    <Modal visible={showModal} transparent animationType="fade">
      <Pressable
        className="h-full w-full items-center justify-center bg-black/50 p-4"
        onPress={() => {
          hideModal();
        }}
      >
        <View className="flex-col space-y-4 overflow-hidden rounded bg-white p-4">
          <Text className="text-xl font-bold">Delete Account</Text>
          <Text className="text-base">
            {"Are you sure you want to delete your account?\n\n"}
            {
              "This action is irreversible and you will lose all your account data as well as all events you have created."
            }
          </Text>
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => {
                hideModal();
              }}
            >
              <Text className="text-base font-bold ">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                try {
                  await deleteAccountMut.mutateAsync();
                } finally {
                  await utils.invalidate();
                  await signOut();
                  hideModal();
                }
              }}
            >
              <Text className="text-base font-bold text-red-500">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export const DeleteAccount = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <DeleteConfirmationModal
        showModal={showModal}
        hideModal={() => setShowModal(false)}
      />

      <PillTouchableOpacity
        className="border-[#ff0000]"
        onPress={() => {
          setShowModal(true);
        }}
      >
        <Text className="text-red-500">
          <FontAwesome6 name="trash" size={15} /> Delete Account
        </Text>
      </PillTouchableOpacity>
    </>
  );
};
