import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Map from '../../shared/components/UIElements/Map';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './PlaceItem.css';

const PlaceItem = props => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  //tapping context
  const auth = useContext(AuthContext);

  //state to handle map visibility
  const [showMap, setShowMap] = useState(false);
  //state to handle Modal visibility
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  //show map handlers
  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);

  //Modal state handlers
  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };
  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };
  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      //Delete a Place HTTP request
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/places/${props.id}`, //placeId through props
        'DELETE',
        null, //no body
        {
          Authorization: 'Bearer' + auth.token, //attach token
        }
      );
      //delete place from frontend (update UI)
      props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__model-actions"
        footer={
          <>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </>
        }
      >
        <p>
          Do you want to proceed and delete this place. It can't be undone
          after!
        </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img
              src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
              alt={props.title}
            />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {/* these buttons only visible if the user is the one created them */}
            {auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}
            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;
