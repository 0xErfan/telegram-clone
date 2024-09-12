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
            className="mx-5 md:mx-0 bg-[#232735] text-white"
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
                            className="ch:text-white"
                            classNames={{ label: 'text-[15px]' }}
                        >
                            {isCheckedText}
                        </Checkbox>

                    </ModalBody>

                    <ModalFooter>

                        <Button
                            color="danger"
                            variant="light"
                            className="text-[16px]"
                            onClick={() => { resetModal!(), onClose!() }}
                        >
                            {cancelText}
                        </Button>

                        <Button
                            color="primary"
                            variant="light"
                            className="text-[16px]"
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