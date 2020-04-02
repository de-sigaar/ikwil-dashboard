import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { DeleteActivity } from "../../store/actions/activitiesActions";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Modal from "react-modal";
import "react-multi-carousel/lib/styles.css";
interface Props {
  activities?: iActivity[] | undefined;
  next?: any;
  previous?: any;
  carouselState?: any;
}

const Summary: React.FC<Props> = ({ activities }) => {
  const initSortedDays = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
  };

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1
    }
  };

  const [sortedDays, setSortedDays] = useState<any>(initSortedDays);
  const [inititialActivities, setCheckActivities] = useState<any>(undefined);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [modalIsOpen, setIsOpen] = React.useState<boolean>(false);
  const [modalContent, setModalContent] = React.useState<any>(false);

  Modal.setAppElement("#root");

  const closeModal = () => {
    setIsOpen(false);
  };

  const onClick = (activity: iActivity) => {
    console.log("activity :", activity);
    setIsOpen(true);
    // if (typeof newsItem.img !== "undefined") {
    //   GetPhoto(newsItem.img)?.then((res: any) => {
    //     SetImg(res);
    //   });
    // }
    setModalContent(activity);
  };

  useEffect(() => {
    if (activities !== inititialActivities) {
      setCheckActivities(activities);
      let tempSortedDays: any = initSortedDays;

      activities?.forEach((activity: iActivity) => {
        if (typeof activity.day !== "undefined") {
          const date = new Date(activity.day.date);
          const dateToday = new Date();
          if (date > dateToday) {
            switch (date.getDay()) {
              case 1:
                tempSortedDays.Monday.push(activity);
                break;
              case 2:
                tempSortedDays.Tuesday.push(activity);
                break;
              case 3:
                tempSortedDays.Wednesday.push(activity);
                break;
              case 4:
                tempSortedDays.Thursday.push(activity);
                break;
              case 5:
                tempSortedDays.Friday.push(activity);
                break;
              case 6:
                tempSortedDays.Saturday.push(activity);
                break;
              case 7:
                tempSortedDays.Sunday.push(activity);
                break;
              default:
                break;
            }
          } else {
            if (typeof activity.id !== "undefined") {
              DeleteActivity(activity.id);
            }
          }
        }

        if (typeof activity.days !== "undefined") {
          activity.days.forEach((day: iDay) => {
            if (day.startTime !== "" && day.endTime !== "") {
              if (day.name === "Monday") {
                tempSortedDays.Monday.push(activity);
              }
              if (day.name === "Tuesday") {
                tempSortedDays.Tuesday.push(activity);
              }
              if (day.name === "Wednesday") {
                tempSortedDays.Wednesday.push(activity);
              }
              if (day.name === "Thursday") {
                tempSortedDays.Thursday.push(activity);
              }
              if (day.name === "Friday") {
                tempSortedDays.Friday.push(activity);
              }
              if (day.name === "Saturday") {
                tempSortedDays.Saturday.push(activity);
              }
              if (day.name === "Sunday") {
                tempSortedDays.Sunday.push(activity);
              }
            }
          });
          setSortedDays(tempSortedDays);
        }
      });
    }
  }, [activities, inititialActivities, sortedDays, initSortedDays]);

  let renderDays: any = [];
  Object.keys(sortedDays).forEach(function(key) {
    renderDays.push(
      <div key={key}>
        {sortedDays[key].map((activity: any) => {
          let times;
          if (typeof activity.days !== "undefined") {
            times = activity.days.find((item: any) => item.name === key);
          }
          if (typeof activity.day !== "undefined") {
            times = activity.day;
          }
          return (
            <div
              key={activity.id + key}
              onClick={e => {
                if (isMoving !== true) {
                  onClick(activity);
                }
              }}
            >
              {/* <Link to={"/activity/" + activity.id} className="c-activity"> */}
              {/* <div to={"/activity/" + activity.id} className="c-activity"> */}
                <div className="c-activity__top-content">
                  <img
                    className="c-activity__top-content__icon"
                    src="/yoga.svg"
                    alt="activity icon"
                  />
                  <h3>{activity.name}</h3>
                </div>
                <div className="c-activity__bottom-content">
                  <div className="c-activity__bottom-content__time">
                    {times.startTime} - {times.endTime}
                  </div>
                  <div className="c-activity__bottom-content__room">
                    {activity.room}
                  </div>
                </div>
              </div>
              // {/* </Link> */}
            // </div>
          );
        })}
      </div>
    );
  });

  const ButtonGroup: React.FC<Props> = ({ next, previous, carouselState }) => {
    const { currentSlide } = carouselState;
    return (
      <div className="c-dayChanger">
        <button
          id="back"
          onClick={() => previous()}
          className="c-dayChanger__arrow"
        >
          <img src="./chevron-left-solid.svg" alt="left chevron" />
        </button>
        <h3 className="c-dayChanger__date">{currentSlide}</h3>
        <button
          id="forward"
          onClick={() => next()}
          className="c-dayChanger__arrow"
        >
          <img src="./chevron-right-solid.svg" alt="right chevron" />
        </button>
      </div>
    );
  };

  return (
    <>
      <h2 className="s-card-big__header">Activiteiten</h2>
      <Carousel
        responsive={responsive}
        infinite={false}
        containerClass="o-carousel"
        dotListClass="o-carousel__dots"
        sliderClass="o-carousel__slider"
        renderButtonGroupOutside={true}
        arrows={false}
        customButtonGroup={<ButtonGroup />}
        beforeChange={() => setIsMoving(true)}
        afterChange={() => setIsMoving(false)}
      >
        {renderDays}
      </Carousel>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, .75)"
          }
        }}
      >
        <div
          className="ReactModal__Content__close-icon"
          onClick={closeModal}
        ></div>
        <div className="ReactModal__Content__image-wrapper">
          {/* <img
            className="ReactModal__Content__image"
            src={}
            alt="toiletrolls-Coronavirus"
          /> */}
        </div>
        <div className="ReactModal__Content__wrapper">
          <h2 className="ReactModal__Content__title">{modalContent.title}</h2>
          <p className="ReactModal__Content__text">{modalContent.text}</p>
        </div>
      </Modal>
    </>
  );
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    DeleteActivity: (docId: string) => dispatch(DeleteActivity(docId))
  };
};
export default connect(null, mapDispatchToProps)(Summary) as React.FC<Props>;
