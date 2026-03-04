import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Textarea,
} from "@material-tailwind/react";

interface EditExamDialogProps {
  open: boolean;
  loading: boolean;
  name: string;
  direction: string;
  onChangeName: (v: string) => void;
  onChangeDirection: (v: string) => void;
  onClose: () => void;
  onSave: () => void;
}

const EditExamDialog = ({
  open,
  loading,
  name,
  direction,
  onChangeName,
  onChangeDirection,
  onClose,
  onSave,
}: EditExamDialogProps) => (
  <Dialog open={open} handler={onClose} size="md">
    <DialogHeader>Chỉnh sửa đề thi</DialogHeader>
    <DialogBody className="space-y-4">
      <Input
        label="Tên đề thi"
        value={name}
        onChange={(e) => onChangeName(e.target.value)}
      />
      <Textarea
        label="Hướng dẫn (Direction)"
        value={direction}
        onChange={(e) => onChangeDirection(e.target.value)}
        rows={4}
      />
    </DialogBody>
    <DialogFooter className="gap-2">
      <Button variant="text" onClick={onClose} disabled={loading}>
        Hủy
      </Button>
      <Button onClick={onSave} disabled={loading} loading={loading}>
        Lưu
      </Button>
    </DialogFooter>
  </Dialog>
);

export default EditExamDialog;
