import { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Textarea,
} from "@material-tailwind/react";
import type { ErrorApiResponse } from "../../../../types/api.type";

interface CreateExamDialogProps {
  open: boolean;
  type: "listening" | "reading";
  onClose: () => void;
  onSuccess: () => void;
  onSubmit: (name: string, direction: string) => Promise<void>;
}

const CreateExamDialog = ({
  open,
  type,
  onClose,
  onSuccess,
  onSubmit,
}: CreateExamDialogProps) => {
  const [name, setName] = useState("");
  const [direction, setDirection] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim() || !direction.trim()) return;
    try {
      setLoading(true);
      await onSubmit(name, direction);
      setName("");
      setDirection("");
      onSuccess();
      onClose();
    } catch (error) {
      const err = error as ErrorApiResponse;
      alert(err.message || "Tạo đề thi thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setDirection("");
    onClose();
  };

  return (
    <Dialog open={open} handler={handleClose} size="md">
      <DialogHeader>
        Tạo đề thi {type === "listening" ? "Listening" : "Reading"} mới
      </DialogHeader>
      <DialogBody className="space-y-4">
        <Input
          label="Tên đề thi"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Textarea
          label="Hướng dẫn (Direction)"
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
          rows={4}
        />
      </DialogBody>
      <DialogFooter className="gap-2">
        <Button variant="text" onClick={handleClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          onClick={handleCreate}
          disabled={loading || !name.trim() || !direction.trim()}
          loading={loading}
        >
          Tạo đề thi
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default CreateExamDialog;
