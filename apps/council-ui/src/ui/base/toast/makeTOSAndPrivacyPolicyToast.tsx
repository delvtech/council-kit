import toast from "react-hot-toast";

const TOAST_HASH = "tos-and-privacy-policy";
export function makeTOSAndPrivacyPolicyToast({
  onAgreeClick,
}: {
  onAgreeClick: () => void;
}): void {
  toast(
    <div className="flex w-full flex-col items-center justify-between gap-2">
      <div className="text-center">
        <h3 className="font-bold">Element.fi Terms of Service</h3>
        <span className="text-xs">Certify and accept terms</span>
      </div>
      <div className="flex gap-2">
        <a
          className="daisy-btn daisy-btn-ghost daisy-btn-sm"
          href="https://delv-public.s3.us-east-2.amazonaws.com/delv-terms-of-service.pdf"
          target="_blank"
          rel="noreferrer"
        >
          Terms of Service
        </a>
        <a
          className="daisy-btn daisy-btn-ghost daisy-btn-sm"
          href="https://delv-public.s3.us-east-2.amazonaws.com/delv-privacy-policy.pdf"
          target="_blank"
          rel="noreferrer"
        >
          Privacy Policy
        </a>
      </div>
      <button
        onClick={() => {
          onAgreeClick();
          toast.dismiss(TOAST_HASH);
        }}
        className="daisy-btn daisy-btn-outline daisy-btn-sm"
      >
        I Agree
      </button>
    </div>,
    {
      id: TOAST_HASH,
      // It might be useful to keep the etherscan link around to investigate the
      // error until explicitly dismissed.
      duration: Infinity,
      position: "bottom-center",
      style: { minWidth: "320px" },
    },
  );
}
