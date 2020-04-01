import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useFirestore } from "react-redux-firebase";
import { Link } from "react-router-dom";
import { DeleteActivity } from "../../store/actions/activitiesActions";
import { Redirect } from "react-router-dom";
import { getSecondPart } from "../../functions/stringSplitting";

interface Props {
  data?: any;
  activity: any;
}

const Activity: React.FC<Props> = ({ activity }) => {
  const firestore = useFirestore();

  const [safeDelete, setSafeDelete] = useState<boolean>(false);
  const [redirect, setRedirect] = useState<boolean>(false);
  const [category, setCategory] = useState<iCategory | undefined>(undefined);
  const [organisers, setOrganisers] = useState<any>([]);
  const [count, setCount] = useState<number>(1);

  const [daysState, setDaysState] = useState<iDay[] | undefined>(undefined);
  const [time, setTime] = useState<iOnce>({
    date: "",
    startTime: "",
    endTime: ""
  });

  useEffect(() => {
    if (typeof activity !== "undefined") {
      if (typeof activity.category !== "undefined") {
        //Category fetch
        firestore
          .collection("categories")
          .doc(getSecondPart(activity.category, "/"))
          .get()
          .then((data: any) => setCategory(data.data()));

        if (
          typeof activity.organisers !== "undefined" &&
          activity.organisers.length > 0
        ) {
          //Organisers fetch
          let organisersIds: any = [];
          activity.organisers.forEach((organizer: iOrganizer) => {
            organisersIds.push(getSecondPart(organizer, "/"));
          });

          let arr: any = [];
          firestore
            .collection("organisers")
            .where("id", "in", organisersIds)
            .get()
            .then((data: any) =>
              data.docs.forEach((doc: any) => {
                arr.push(doc.data());
                setOrganisers(arr);
                setCount(Math.floor(Math.random() * Math.floor(100)));
                //TO:DO Netter maken
              })
            );

          if (typeof activity.days !== "undefined") {
            setDaysState(activity.days);
          }
          if (typeof activity.day !== "undefined") {
            setTime(activity.day);
          }
        }
      }
    }
  }, [activity, firestore]);
  if (typeof activity !== "undefined") {
    const handleDelte = () => {
      if (typeof activity.id !== "undefined") {
        DeleteActivity(activity.id);
        setRedirect(true);
      }
    };

    if (!redirect) {
      return (
        <div className={count.toString()}>
          <div>
            <h2>Activity stuff</h2>
            <div>{activity.name}</div>
            <div>{activity.room}</div>
            <div>{activity.createdBy}</div>
            <h3>Wanneer</h3>
            {time.date !== "" ? (
              <div>
                <div>{time.date}</div>
                <div>
                  Van
                  <div>{time.startTime}</div>
                  Tot
                  <div>{time.endTime}</div>
                </div>
              </div>
            ) : null}
            {typeof daysState !== "undefined" ? (
              <div>
                {daysState.map((day: iDay) => {
                  return (
                    <div key={day.name}>
                      {day.startTime !== "" && day.endTime !== "" ? (
                        <div>
                          <h5>{day.name}</h5>
                          <div>{day.startTime}</div>tot<div>{day.endTime}</div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
          {typeof category !== "undefined" ? (
            <div>
              <h2>Category stuff</h2>
              <div>{category.name}</div>
              <div>{category.bio}</div>
              <div>{category.color}</div>
              <div>{category.icon}</div>
            </div>
          ) : null}

          {typeof organisers !== "undefined" ? (
            <div>
              <h2>Organizer stuff</h2>
              {organisers.length === 0 ? (
                <>Er zijn geen kartrekkers toegevoegd</>
              ) : (
                <>
                  {organisers.map((organizer: iOrganizer) => {
                    return <div key={organizer.id}>{organizer.name}</div>;
                  })}
                </>
              )}
            </div>
          ) : null}
          <Link to={"activity/" + activity.id + "/edit"}>edit</Link>
          <button onClick={() => setSafeDelete(true)}>delete</button>
          {safeDelete ? (
            <div>
              Are you sure you want to delete it?
              <button onClick={() => setSafeDelete(false)}>No</button>
              <button onClick={() => handleDelte()}>yes</button>
            </div>
          ) : null}
        </div>
      );
    } else {
      return <Redirect to={"/admin/activity"} />;
    }
  } else {
    return null;
  }
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    DeleteActivity: (docId: string) => dispatch(DeleteActivity(docId))
  };
};

export default connect(null, mapDispatchToProps)(Activity) as React.FC<Props>;
