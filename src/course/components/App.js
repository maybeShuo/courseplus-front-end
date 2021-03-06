import React, { Component } from 'react';

import Dialog from "../../base/components/Dialog";
import Header from "../../base/components/Header";
import Footer from "../../base/components/Footer";
import FormatUtil from "../../base/util/FormatUtil";
import ServiceClient from "../../base/service/ServiceClient";
import WebStorageUtil from "../../base/util/WebStorageUtil";
import { HOST } from "../../base/util/ConstantUtil";

import Course from "./Course";
import Question from "./Question";

export default class App extends Component {

    constructor (props) {
        super(props);

        this.handleDialogShow = this.handleDialogShow.bind(this);
        this.handleDialogHide = this.handleDialogHide.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleCourseSelect = this.handleCourseSelect.bind(this);
        this.handleQuestionShow = this.handleQuestionShow.bind(this);
        this.handleQuestionHide = this.handleQuestionHide.bind(this);
    }

    static defaultProps = {

    }

    static propTypes = {

    }

    state = {
        isLogin: false,
        user: null,
        courseInfo: null,
        returnPayInfo: null
    }

    componentDidMount()
    {
        this.appContainer = this.refs["appContainer"];
        this.dialogContainer = this.refs["dialogContainer"];
        this.questionContainer = this.refs["questionContainer"];
        this.autoLogin();
    }

    autoLogin()
    {
        let isLogin = false;
        let user = null;

        ServiceClient.getInstance().autoLogin().then(res => {
            if (res.status === 0)
            {
                isLogin = true;
                WebStorageUtil.setToken(res.token);
                user = res;
            }
            this.loadCourseData(isLogin, user);
        });
    }

    loadCourseData(isLogin, user = null)
    {
        let courseId = WebStorageUtil.getCourseStorage();
        const returnInfo = WebStorageUtil.getReturnPayStorage();
        let info = this.state.returnPayInfo;
        if (location.href.split("?").length > 1 && !courseId)
        {
            courseId = FormatUtil.parseQuery(location.href.split("?")[1])["id"];
        }

        if (returnInfo)
        {
            courseId = returnInfo.courseId;
            info = returnInfo;
            WebStorageUtil.removeReturnPayStorage();
        }
        if (!courseId)
        {
            location.href = HOST + "/home.html";
        }
        WebStorageUtil.setCourseStorage(courseId);
        ServiceClient.getInstance().getCourseDetail(courseId).then(res => {
            this.setState({
                isLogin,
                user,
                courseInfo: res,
                returnPayInfo: info
            });
        });
    }

    handleDialogShow()
    {
        this.appContainer.classList.add("app-blur");
        this.dialogContainer.style.zIndex = 20;
    }

    handleDialogHide()
    {
        this.appContainer.classList.remove("app-blur");
        this.dialogContainer.style.zIndex = 0;
    }

    handleQuestionShow()
    {
        this.appContainer.classList.add("app-blur");
        this.questionContainer.style.zIndex = 20;
    }

    handleQuestionHide()
    {
        this.appContainer.classList.remove("app-blur");
        this.questionContainer.style.zIndex = 0;
    }


    handleLogin(user)
    {
        this.setState({
            isLogin: true,
            user: user
        });
    }

    handleCourseSelect(courseId)
    {
        const course = this.state.courseInfo;
        if (course.id !== courseId)
        {
            WebStorageUtil.setCourseStorage(courseId);
            ServiceClient.getInstance().getCourseDetail(courseId).then(res => {
                this.setState({
                    courseInfo: res,
                    returnPayInfo: null
                });
            });
        }
    }


    render()
    {
        const state = this.state;

        return (
            <div className="cp-course-app">
                <div ref="dialogContainer" className="dialog-container">
                    <Dialog
                        onDialogHide={this.handleDialogHide}
                        onLogin={this.handleLogin}
                    />
                </div>
                <div ref="questionContainer" className="question-container">
                    <Question
                        onQuestionHide={this.handleQuestionHide}
                    />
                </div>
                <div ref="appContainer" className="app-container">
                    <header>
                        <Header
                            isLogin={state.isLogin}
                            user={state.user}
                            onDialogShow={this.handleDialogShow}
                        />
                    </header>
                    <div className="container">
                        <Course
                            course={state.courseInfo}
                            user={state.user}
                            returnInfo={state.returnPayInfo}
                            onCourseSelect={this.handleCourseSelect}
                            onQuestionShow={this.handleQuestionShow}
                         />
                    </div>
                    <footer><Footer /></footer>
                </div>
            </div>
        );
    }
}
