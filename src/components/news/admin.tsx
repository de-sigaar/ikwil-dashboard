import React from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Link } from "react-router-dom";
import NewsItem from "./adminNewsItem";
import News from "./index";

interface Props {
  news: iNewsItem[];
  profile?: any;
  auth?: any;
}

const Admin: React.FC<Props> = ({ news, profile, auth }) => {
  if (typeof news !== "undefined") {
    return (
      <div>
        <News />
        {news.map((newsitem: any) => {
          return (
            <div key={newsitem.id}>
              <NewsItem newsItem={newsitem} />
            </div>
          );
        })}
        <div>
          <Link to={"/admin/news/add"}>
            <button
              onChange={e => {
                e.preventDefault();
              }}
            >
              Voeg toe!
            </button>
          </Link>
        </div>
      </div>
    );
  } else {
    return <div>No News found!</div>;
  }
};

const mapStateToProps = (state: any) => {
  return {
    news: state.firestore.ordered.news,
    profile: state.firebase.profile,
    auth: state.firebase.auth
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([{ collection: "news" }])
)(Admin) as React.FC<Props>;
