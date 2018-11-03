import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

import NotFound from "../presentationals/NotFound";

class ConfirmRegistration extends Component {
  state = { success: false, errorPage: false, email: "" };

  async componentDidMount() {
    const {
      match: { params },
      history
    } = this.props;
    const res = await axios({
      method: "POST",
      url: "/api/users/userid",
      data: { userId: params.userId, user: false }
    });
    if (res.data.success) {
      this.setState({ success: true });
      setTimeout(() => {
        history.push("/");
      }, 3000);
    } else {
      this.setState({ errorPage: true });
    }
  }

  render() {
    if (this.state.success) {
      return (
        <div>
          <h4>You have successfully signed up!</h4>
          <p>You'll be redireted shortly...</p>
        </div>
      );
    } else if (this.state.errorPage) {
      return <NotFound />;
    }
    return <div />;
  }
}

export default withRouter(ConfirmRegistration);
