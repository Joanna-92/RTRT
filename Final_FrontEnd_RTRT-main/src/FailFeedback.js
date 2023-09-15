import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { WarningRounded } from "@mui/icons-material";

/**
 * @param {PropTypes.InferProps<Feedback.propTypes>} props
 */
const FailFeedback = ({ open, title, message, severity, handleClose }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { py: 5, px: 8 } }}
    >
      {title && (
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: "600",
            fontSize: "x-large",
            pb: 2,
          }}
        >
          {title}
        </DialogTitle>
      )}
      {severity === "warning" && (
        <WarningRounded
          color={severity}
          sx={{ display: "flex", mx: "auto", fontSize: "xxx-large" }}
        />
      )}
      <DialogContent sx={{ textAlign: "center", py: 3 }}>
        {message}
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "center",
        }}
      >
        <Button variant="contained" sx={{ px: 12 }} onClick={handleClose}>
          Schließen
        </Button>
      </DialogActions>
    </Dialog>
  );
};

FailFeedback.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.node.isRequired,
  severity: PropTypes.oneOf(["error", "info", "warning", "success"]),
  handleClose: PropTypes.func.isRequired,
};

FailFeedback.defaultProps = {
  severity: "info",
};

export default FailFeedback;
