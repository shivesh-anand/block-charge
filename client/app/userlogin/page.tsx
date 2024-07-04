'use client';
import { Modal, ModalContent, Button, useDisclosure } from '@nextui-org/react';
import { UserIcon } from '@/components/icons';
import { UserLoginForm } from '@/components/UserLogin';

export default function UserLoginPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Button
        onPress={onOpen}
        className="text-sm font-normal text-default-600 bg-default-100"
        variant="flat"
        startContent={<UserIcon className="text-primary" />}
      >
        Login as User
      </Button>
      <Modal
        size="xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <UserLoginForm />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
