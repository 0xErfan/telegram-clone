'use client'

import useGlobalVariablesStore from "@/zustand/globalVariablesStore";
import { Button } from "@nextui-org/button";
import { Modal as NextUiModal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Checkbox } from '@nextui-org/checkbox'

const Modal = () => {

    const { modalData, setter } = useGlobalVariablesStore(state => state)

    const {
        title,
        isOpen,
        okText,
        bodyText,
        isChecked,
        cancelText,
        isCheckedText,
        onClose,
        onSubmit,
        resetModal
    } = modalData

    const toggleIsCheckedValue = () => {
        setter({
            modalData: {
                ...modalData,
                isChecked: !isChecked
            }
        })
    }

    return (
        <NextUiModal
            isOpen={isOpen}
            placement="center"
            onClose={() => { resetModal!(), onClose!() }}
        >
            <ModalContent>
                <>
                    <ModalHeader>{title}</ModalHeader>

                    <ModalBody>

                        {bodyText}

                        <Checkbox
                            hidden={Boolean(isCheckedText?.length)}
                            isSelected={isChecked}
                            onValueChange={toggleIsCheckedValue}
                            className="text-sm"
                        >
                            {isCheckedText}
                        </Checkbox>

                    </ModalBody>

                    <ModalFooter>

                        <Button
                            color="danger"
                            variant="flat"
                            onClick={() => { resetModal!(), onClose!() }}
                        >
                            {cancelText}
                        </Button>

                        <Button
                            color="primary"
                            onClick={() => { onSubmit(), resetModal!() }}
                        >
                            {okText}
                        </Button>

                    </ModalFooter>
                </>
            </ModalContent>
        </NextUiModal>
    );
}


export default Modal;