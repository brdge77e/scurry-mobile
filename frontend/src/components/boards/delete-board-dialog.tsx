import React from 'react';
import { AlertDialog } from '../ui/alert-dialog';

interface DeleteBoardDialogProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  boardName: string;
}

export function DeleteBoardDialog({
  visible,
  onClose,
  onConfirm,
  boardName,
}: DeleteBoardDialogProps) {
  return (
    <AlertDialog
      visible={visible}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Board"
      description={`Are you sure you want to delete "${boardName}"? This action cannot be undone.`}
      confirmText="Delete"
      cancelText="Cancel"
      confirmStyle="destructive"
    />
  );
} 