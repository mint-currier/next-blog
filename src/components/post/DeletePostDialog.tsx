import { deletePost } from "@/lib/actions/deletePost";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

type DeletePostDialogProps = {
  postId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function DeletePostDialog({
  postId,
  isOpen,
  onOpenChange,
}: DeletePostDialogProps) {
  return (
    <div>
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>記事の削除</AlertDialogTitle>
            <AlertDialogDescription>
              削除してもよろしいですか？
              <br />
              この操作は取り消しできません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletePost(postId)}
              className="bg-red-500 hover:bg-red-500"
            >
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
