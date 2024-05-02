import { Button } from '@/components/ui/button';
import * as Dialog from '@radix-ui/react-dialog';
import { PlusIcon } from 'lucide-react';
type ModalCusProps = {
  contentBtn: string;
  childContent: React.ReactNode;
  open: boolean;
  handleOpen: () => void;
}
const ModalCus: React.FC<ModalCusProps> = ({ contentBtn, childContent, open, handleOpen }) => (
  <Dialog.Root open={open}>
    <Dialog.Trigger asChild>
      <div className='flex justify-end'>
        <Button type="submit" className="space-x-1"
          onClick={handleOpen}
        >
          <PlusIcon className="w-4 h-4" />
          <span>{contentBtn}</span>
        </Button>
      </div>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
      <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[800px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
        {childContent}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default ModalCus;
