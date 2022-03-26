import React from "react";
import "./css/candidates.css";

const Phase = () => {
  return (
    <div
    // style={{
    //   display: 'flex',
    //   justifyContent: 'center',
    //   alignItems: 'center',
    //   height: '90vh'
    // }}
    >
      <div className="container py-5">
        <div className="row text-center text-white">
          <div className="col-lg-8 mx-auto">
            <h1 className="display-4">Phase Page</h1>
            <p className="lead mb-0">
              Using Bootstrap 4 grid and utilities, create a nice team page.
            </p>
            <p className="lead">
              Snippet by
              <a
                href="https://bootstrapious.com/snippets"
                className="text-white"
              >
                <u>Bootstrapious</u>
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row text-center">
          <div className="col-xl-3 col-sm-6 mb-5">
            <div className="bg-white rounded shadow-sm py-5 px-4">
              <img
                src="https://bootstrapious.com/i/snippets/sn-team/teacher-4.jpg"
                alt=""
                width="100"
                className="img-fluid rounded-circle mb-3 img-thumbnail shadow-sm"
              />
              <h5 className="mb-0">Start Election</h5>
              <span className="small text-uppercase text-muted">
                CEO - Founder
              </span>
              <button className="btn btn-lg btn-success mt-4">Start Election</button>
            </div>
          </div>

          <div className="col-xl-3 col-sm-6 mb-5">
            <div className="bg-white rounded shadow-sm py-5 px-4">
              <img
                src="https://bootstrapious.com/i/snippets/sn-team/teacher-2.jpg"
                alt=""
                width="100"
                className="img-fluid rounded-circle mb-3 img-thumbnail shadow-sm"
              />
              <h5 className="mb-0">End Election</h5>
              <span className="small text-uppercase text-muted">
                CEO - Founder
              </span>
              <button className="btn btn-lg btn-danger mt-4">End Election</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Phase;
