import React, { Component } from 'react';

import FormatUtil from "../../base/util/FormatUtil";
import ServiceClient from "../../base/service/ServiceClient";
import WebStorageUtil from "../../base/util/WebStorageUtil";

import Reply from "./Reply";

export default class Comment extends Component {

    constructor (props) {
        super(props);

        this.updateReplyInput = this.updateReplyInput.bind(this);
        this.showReply = this.showReply.bind(this);
        this.handleCommentReply = this.handleCommentReply.bind(this);
    }

    static defaultProps = {
        rootComment: {
            authorName: "",
            content: "",
            replyTime: "",
            replyCount: "",
            authorIcon: null
        },
        topic: null
    }

    static propTypes = {

    }

    state = {
        isExpanded: false,
        replyList: []
    }

    componentDidMount()
    {
        this.replyInput = this.refs["replyInput"];
    }

    componentWillReceiveProps(nextProps)
    {

    }

    replyInput_onfocus(e)
    {
        e.target.style.height = "120px";
    }

    replyInput_onblur(e)
    {
        e.target.style.height = "auto";
    }

    updateReplyInput(replyName)
    {
        this.replyInput.value = "回复 " + replyName + ":";
    }

    showReply()
    {
        const btnShowReply = this.refs.btnShowReply;
        const replyList = this.state.replyList;
        const {rootComment, topic} = this.props;
        if (this.state.isExpanded) {
            btnShowReply.innerHTML = "回复 " + replyList.length;
            this.setState({
                isExpanded: false
            });
        }
        else
        {
            btnShowReply.innerHTML = "收起回复";

            ServiceClient.getInstance().getReplyList({
                topicId: topic.id,
                commentId: rootComment.id
            }).then(res => {
                this.setState({
                    isExpanded: true,
                    replyList: res
                });
            });

        }
    }

    handleCommentReply()
    {
        const text = this.replyInput.value;
        const replyId = this.props.rootComment.id;
        const replyList = this.state.replyList;
        if (text !== "")
        {
            const token = WebStorageUtil.getToken();
            const topic = this.props.topic;
            if (token)
            {
                ServiceClient.getInstance().replyComment({
                    topicId: topic.id,
                    replyId,
                    content: text
                }, token).then(res => {
                    if (res.textStatus === "success")
                    {
                        this.replyInput.value = "";
                        replyList.push(res);
                        this.setState({
                            replyList: replyList
                        })
                        alert("回复成功");
                    }
                    else
                    {
                        alert("回复失败");
                    }
                });
            }
            else
            {
                alert("请先登录");
            }
        }
        else
        {
            alert("请输入评论内容");
        }
    }

    render()
    {
        const rootComment = this.props.rootComment;
        const replyList = this.state.replyList;
        let authorIcon1 = "http://blog.bzxxg.cn/wp-content/uploads/2013/07/guest.png";
        let authorIcon2 = "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSeiPB1slh_EwpLQzoRaYX7duYX4vVvPDqhVX2MReSVucJhUtEAo3s-UA";
        return (
            <div className="cp-course-comment">
                <div className="root-comment">
                    <div className="commenter-img">
                        <img src={rootComment.authorIcon ? rootComment.authorIcon : authorIcon2} />
                    </div>
                    <div className="right-section">
                        <div className="name">{rootComment.authorName}</div>
                        <div className="content">{rootComment.content}</div>
                        <div className="bottom-bar">
                            <div className="comment-date">{rootComment.replyTime}</div>
                            <a ref="btnShowReply"
                               href={'#comment' + rootComment.id}
                               data-toggle="collapse"
                               onMouseDown={this.showReply}
                               className="show-reply"
                             >回复&nbsp;{rootComment.replyCount > 0 ? rootComment.replyCount : ""}</a>
                        </div>
                    </div>
                </div>
                <div id={'comment' + rootComment.id} ref="replySection" className="reply-section collapse">
                    <ul className="reply-list">
                        {replyList.map(item => {
                            return (
                                <li key={item.id}>
                                    <Reply onReplyClick={this.updateReplyInput} reply={item} />
                                </li>
                            );
                        })}
                    </ul>
                    <div className="reply-input">
                        <textarea
                            ref="replyInput"
                            className="forum-textarea"
                            placeholder="我要评论"
                            onFocus={this.replyInput_onfocus}
                            onBlur={this.replyInput_onblur}
                        />
                    </div>
                    <div className="bar">
                        <div onMouseDown={this.handleCommentReply} className="btn-reply">
                            <span>回复</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
