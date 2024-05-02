import * as Dialog from '@radix-ui/react-dialog';

const RouteContentModal = () => {
  return (
    <>
      <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
        Route content
      </Dialog.Title>
      <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
        Make changes to your profile here. Click save when you're done.
      </Dialog.Description>
      <fieldset className="mb-[15px] flex items-center gap-5">
        <label className="text-violet11 w-[90px] text-right text-[15px]" htmlFor="name">
          Name
        </label>
        <input
          className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
          id="name"
          defaultValue="Pedro Duarte"
        />
      </fieldset>
      <fieldset className="mb-[15px] flex items-center gap-5">
        <label className="text-violet11 w-[90px] text-right text-[15px]" htmlFor="username">
          Username
        </label>
        <input
          className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
          id="username"
          defaultValue="@peduarte"
        />
      </fieldset>
      <div className="mt-[25px] flex justify-end">
        <Dialog.Close asChild>
          <button className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
            Save changes
          </button>
        </Dialog.Close>
      </div>
      <Dialog.Close asChild>
        <button
          className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
          aria-label="Close"
        >
          X
        </button>
      </Dialog.Close>
    </>
  )
}
export default RouteContentModal;
