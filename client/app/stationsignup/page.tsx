'use client';
import { Modal, ModalContent, Button, useDisclosure } from '@nextui-org/react';
import { StationIcon } from '@/components/icons';
import { StationSignupForm } from '@/components/StationSignUp';

export default function StationSignUpPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Button
        onPress={onOpen}
        className="text-sm font-normal text-default-600 bg-default-100"
        variant="flat"
        startContent={<StationIcon className="text-primary" />}
      >
        Sign up as Station
      </Button>
      <Modal
        size="xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        backdrop="blur"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <StationSignupForm />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
