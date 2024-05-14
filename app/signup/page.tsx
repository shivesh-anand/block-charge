'use client';
import { SignupForm } from '@/components/SignUp';
import { Modal, ModalContent, Button, useDisclosure } from '@nextui-org/react';
import { HeartFilledIcon } from '@/components/icons';

export default function SignUpPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Button
        onPress={onOpen}
        className="text-sm font-normal text-default-600 bg-default-100"
        startContent={
          <HeartFilledIcon className="text-danger" variant="flat" />
        }
      >
        Sign up
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
              <SignupForm />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
