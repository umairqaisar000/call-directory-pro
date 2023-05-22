import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "../../utils/axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

const TableItem = ({ item, handleShow, handleClose, show, updateData }) => {
  const [noteContent, setNoteContent] = useState("");
  const TimeFormat = (time) => {
    const seconds = time;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedTime = `${minutes} mins ${remainingSeconds} sec (${time})`;

    return formattedTime;
  };

  const handleNoteSubmit = async (event) => {
    event.preventDefault();
    const accessToken = localStorage.getItem("token");

    const callId = item.id; // Replace with the actual call ID
    const url = `/calls/${callId}/note`;
    const requestBody = { content: noteContent };

    try {
      const response = await axios.post(url, requestBody, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      updateData();
      setNoteContent("");
      handleClose();
    } catch (error) {
      console.error(error);
      handleClose();
    }
  };

  const handleArchive = async () => {
    const accessToken = localStorage.getItem("token");

    const callId = item.id;
    const url = `/calls/${callId}/archive`;

    try {
      const response = await axios.put(url, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      updateData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatus = (status) => {
    if (status) {
      return (
        <div
          className="btn"
          style={{ color: "#7DE0D6", backgroundColor: "#EDFBFA" }}
          onClick={handleArchive}
        >
          Archived
        </div>
      );
    } else {
      return (
        <div
          className="btn"
          style={{ color: "#727272", backgroundColor: "#EEEEEE" }}
          onClick={handleArchive}
        >
          Unarchive
        </div>
      );
    }
  };

  return (
    <>
      <tr>
        <td className="text-capitalize">{item.call_type}</td>
        <td className="text-capitalize">{item.direction}</td>
        <td className="text-capitalize">{TimeFormat(item.duration)}</td>
        <td className="text-capitalize">{item.from}</td>
        <td className="text-capitalize">{item.to}</td>
        <td className="text-capitalize">{item.via}</td>
        <td className="text-capitalize">{item.created_at}</td>
        <td className="text-capitalize">{handleStatus(item.is_archived)}</td>
        <td>
          <Button style={{ backgroundColor: "#4F46F8" }} onClick={handleShow}>
            Add Note
          </Button>
        </td>
      </tr>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Notes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ color: "#7D77FA" }}>Call ID {item.id}</div>
          <div className="mt-4 d-flex flex-column">
            <p className="mb-0">
              <span className="h6">Call Type</span>{" "}
              <span className="text-capitalize" style={{ color: "#7D77FA" }}>
                {item.call_type}
              </span>
            </p>
            <p className="mb-0">
              <span className="h6">Duration</span>{" "}
              <span className="text-capitalize">
                {TimeFormat(item.duration)}
              </span>
            </p>
            <p className="mb-0">
              <span className="h6">From</span>{" "}
              <span className="text-capitalize">{item.from}</span>
            </p>
            <p className="mb-0">
              <span className="h6">To</span>{" "}
              <span className="text-capitalize">{item.to}</span>
            </p>
            <p className="mb-0">
              <span className="h6">Via</span>{" "}
              <span className="text-capitalize">{item.via}</span>
            </p>
          </div>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleNoteSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TableItem;
