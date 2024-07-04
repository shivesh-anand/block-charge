'use client';
import { Modal, ModalContent, Button, useDisclosure } from '@nextui-org/react';
import { StationIcon } from '@/components/icons';
import { StationLoginForm } from '@/components/StationLogin';

export default function StationLoginPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Button
        onPress={onOpen}
        className="text-sm font-normal text-default-600 bg-default-100"
        variant="flat"
        startContent={<StationIcon className="text-primary" />}
      >
        Login as Station
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
              <StationLoginForm />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
