import React, { Component } from 'react';

import FormatUtil from "../../base/util/FormatUtil";
import ServiceClient from "../../base/service/ServiceClient";
import WebStorageUtil from "../../base/util/WebStorageUtil";

export default class Contributor extends Component {

    constructor (props) {
        super(props);

        this.handleCourseSelect = this.handleCourseSelect.bind(this);
        this.handleResourceDownload = this.handleResourceDownload.bind(this);
        this.handleQuestionPublish = this.handleQuestionPublish.bind(this);
    }

    static defaultProps = {
        info: null
    }

    static propTypes = {

    }

    state = {

    }

    handleCourseSelect(courseId)
    {
        this.props.onCourseSelect(courseId);
    }

    handleResourceDownload()
    {
        const token = WebStorageUtil.getToken();
        if (token)
        {
            const info = this.props.info;
            const cost = (info.resourceCost / 100);
            const name = info.name;
            const onResourceDownload = this.props.onResourceDownload;
            let winTemp = window.open("", FormatUtil.getWindowOpenTemp());
            ServiceClient.getInstance().getDownloadUrl(info.attachmentId).then(res => {
                if (res.code === 0)
                {
                    setTimeout(() => {
                        winTemp.location.href = res.message;
                    }, 500);
                }
                else
                {
                    winTemp.close();
                    swal({
                        title: "打包下载独家资料",
                        text: `独家资料是${name}亲自整理的独家资料的合集，打包购买有优惠，向${name}支付￥${cost}获取整套秘籍下载资格！`,
                        showCancelButton: true,
                        confirmButtonColor: "#038574",
                        confirmButtonText: "确认支付",
                        cancelButtonText: "暂不支付",
                        customClass: "swal-resource-dialog",
                        closeOnConfirm: true,
                        closeOnCancel: true
                    },(isConfirm) => {
                        if (isConfirm)
                        {
                            onResourceDownload(info.attachmentId, info.resourceCost);
                        }
                    });
                }
            });
        }
        else
        {
            swal({
              title: "Something wrong!",
              text: "请先登录",
              type: "error"
            });
        }
    }

    handleQuestionPublish()
    {
        const author = this.props.info;

        const token = WebStorageUtil.getToken();
        if (token)
        {
            const cost = (author.contactCost / 100);
            const name = author.name;
            ServiceClient.getInstance().getQuestionChance(author.id).then(res => {
                if (res.textStatus === "success")
                {
                    this.props.onQuestionShow(author);
                }
                else
                {
                    swal({
                        title: "向大神提问",
                        text: `想要向${name}直接提问？向${name}支付￥${cost}来获得一次140字的提问机会，我们会亲自帮您联系大神，并尽快以邮件的形式给您答复！`,
                        showCancelButton: true,
                        confirmButtonColor: "#038574",
                        confirmButtonText: "确认支付",
                        cancelButtonText: "暂不支付",
                        customClass: "swal-resource-dialog",
                        closeOnConfirm: true,
                        closeOnCancel: true
                    },(isConfirm) => {
                        if (isConfirm)
                        {
                            this.props.onQuestionPublish(author.contactCost);
                        }
                    });
                }
            });
        }
        else
        {
            swal({
              title: "Something wrong!",
              text: "请先登录",
              type: "error"
            });
        }
    }

    render()
    {
        const info = this.props.info;
        const course = this.props.curCourse;
        let relatedCourses = [];
        if (info)
        {
            relatedCourses = info.courses.filter(item => item.id !== course.id);
        }

        return (
            <div className="cp-course-contributor">
                <div className="image">
                    <img src={info ? info.avatar : null} />
                </div>
                <div className="name">
                    {info ? info.name : ""}
                </div>
                <div className="intro">
                    {info ? info.description : ""}
                </div>
                <div onClick={this.handleQuestionPublish} className="contact">
                    <span className="icon iconfont icon-message"></span>
                    向大神提问
                </div>
                <div onClick={this.handleResourceDownload} className="resource">
                    <span className="icon iconfont icon-download"></span>
                    打包下载独家资料
                </div>
                <div className="others">
                    {relatedCourses.length > 0 ? "他的其他课程" : ""}
                </div>
                <ul className="others-courses">
                    {relatedCourses.map(item => {
                        return (
                            <li
                                key={item.id}
                                onClick={() => this.handleCourseSelect(item.id)}
                            >
                                {item.name}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}
