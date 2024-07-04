'use client';
import { Modal, ModalContent, Button, useDisclosure } from '@nextui-org/react';
import { UserIcon } from '@/components/icons';
import { UserSignupForm } from '@/components/UserSignUp';

export default function UserSignUpPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Button
        onPress={onOpen}
        className="text-sm font-normal text-default-600 bg-default-100"
        variant="flat"
        startContent={<UserIcon className="text-primary" />}
      >
        Sign up as User
      </Button>
      <Modal
        size="xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <UserSignupForm />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
