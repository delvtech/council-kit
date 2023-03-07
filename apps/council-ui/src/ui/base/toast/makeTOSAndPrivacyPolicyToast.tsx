import toast from "react-hot-toast";

const TOAST_HASH = "tos-and-privacy-policy";
export function makeTOSAndPrivacyPolicyToast({
  onAgreeClick,
}: {
  onAgreeClick: () => void;
}): void {
  toast(
    <div className="flex flex-col gap-2 w-full justify-between items-center">
      <div className="text-center">
        <h3 className="font-bold">Element.fi Terms of Service</h3>
        <span className="text-xs">Certify and accept terms</span>
      </div>
      <div className="flex gap-2">
        <a
          className="daisy-btn daisy-btn-sm daisy-btn-ghost"
          href="https://elementfi.s3.us-east-2.amazonaws.com/element-finance-terms-of-service-02-03-2023.pdf"
          target="_blank"
          rel="noreferrer"
        >
          Terms of Service
        </a>
        <a
          className="daisy-btn daisy-btn-sm daisy-btn-ghost"
          href="https://elementfi.s3.us-east-2.amazonaws.com/element-finance-privacy-policy-02-03-23.pdf"
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
        className="daisy-btn daisy-btn-sm daisy-btn-outline"
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
