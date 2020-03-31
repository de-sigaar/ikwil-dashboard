import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { EditOrganizer } from "../../../store/actions/organizerActions";
import { Redirect } from "react-router-dom";

interface Props {
  link?: any;
  profile?: any;
  organizer?: iOrganizer;
  auth?: any;
}

const Edit: React.FC<Props> = ({ organizer, auth, profile, link }) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [place, setPlace] = useState<string>("");
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [redirect, setRedirect] = useState<boolean>(false);
  useEffect(() => {
    if (typeof organizer !== "undefined") {
      setName(organizer.name);
      setDescription(organizer.description);
      if (typeof organizer.place !== "undefined") {
        setPlace(organizer.place);
      }
      if (typeof organizer.isAvailable !== "undefined") {
        setIsAvailable(organizer.isAvailable);
      }
    }
  }, [organizer]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    EditOrganizer(
      { name, description, place, isAvailable },
      profile,
      auth.uid,
      link.params.id
    );
    setRedirect(true);
  };
  if (typeof organizer !== "undefined") {
    if (!redirect) {
      return (
        <div className="s-cms">
          <div className="s-cms__form-conatiner">
            <h2 className="s-cms__header">Bewerk bestuurslid</h2>
            <form onSubmit={e => handleSubmit(e)}>
              <div className="o-inputfield">
                <label>Naam</label>
                <input
                  className="o-inputfield__input"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div className="o-inputfield">
                <label>Beschrijving van je werkzaamheden</label>
                <input
                  className="o-inputfield__input"
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
              <div className="o-inputfield">
                <label>Plaats waar je het meeste bent</label>
                <input
                  className="o-inputfield__input"
                  required
                  value={place}
                  onChange={e => setPlace(e.target.value)}
                />
              </div>
              <div className="o-inputfield">
                <label className="checkbox-container">
                  <label>Beschikbaar</label>
                  <input
                    required
                    type="checkbox"
                    checked={isAvailable}
                    onChange={e => setIsAvailable(!isAvailable)}
                  />
                  <span className="checkmark"></span>
                </label>
              </div>
              <button>update bestuurslid</button>
            </form>
          </div>
        </div>
      );
    } else {
      return <Redirect to={"/organizer/" + link.params.id} />;
    }
  } else {
    return <>Error</>;
  }
};
const mapStateToProps = (state: any) => {
  if (typeof state.firestore.ordered.organisers !== "undefined") {
    return {
      organizer: state.firestore.ordered.organisers[0],
      profile: state.firebase.profile,
      auth: state.firebase.auth
    };
  } else {
    return {};
  }
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    EditOrganizer: (organizer: any, profile: any, id: string, docId: string) =>
      dispatch(EditOrganizer(organizer, profile, id, docId))
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect((props: Props) => [
    { collection: "organizer", doc: props.link.params.id }
  ])
)(Edit) as React.FC<Props>;
