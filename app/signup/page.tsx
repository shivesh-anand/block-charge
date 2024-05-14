'use client';
import { SignupForm } from '@/components/SignUp';
import {
  Modal,
  ModalContent,
  Button,
  useDisclosure,
  Link,
} from '@nextui-org/react';
import { HeartFilledIcon } from '@/components/icons';

export default function SignUpPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Button
        onPress={onOpen}
        className="text-sm font-normal text-default-600 bg-default-100"
        variant="flat"
        startContent={<HeartFilledIcon className="text-danger" />}
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
