// import { toast } from "@/hooks/use-toast";
// import { Button } from "@/components/ui/button";

// export const showConfirmToast = ({
//   title,
//   description,
//   onConfirm,
// }: {
//   title: string;
//   description: string;
//   onConfirm: () => void;
// }) => {
//   const t = toast({
//     duration: Infinity, // or remove if you don't want auto close
//     description: (
//       <div className="w-full min-w-[320px]">
//         <div className="space-y-2">
//           <h3 className="text-base font-semibold">{title}</h3>
//           <p className="text-sm text-muted-foreground">{description}</p>
//         </div>

//         <div className="mt-5 flex justify-end gap-2 border-t pt-4">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => {
//               t.dismiss();
//             }}
//           >
//             Cancel
//           </Button>

//           <Button
//             variant="destructive"
//             size="sm"
//             onClick={() => {
//               t.dismiss();
//               onConfirm();
//             }}
//           >
//             Confirm
//           </Button>
//         </div>
//       </div>
//     ),
//   });
// };

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export const showConfirmToast = ({
  title,
  description,
  onConfirm,
}: {
  title: string;
  description: string;
  onConfirm: () => void;
}) => {
  const t = toast({
    duration: Infinity, 
    description: (
      <div className="w-full min-w-[320px]">
        <div className="space-y-2">
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="mt-5 flex justify-end gap-2 border-t pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              t.dismiss();
            }}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              t.dismiss();
              onConfirm();
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    ),
  });
};