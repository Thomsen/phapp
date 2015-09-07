var Comment = React.createClass({
  handlerJump:function(){
    window.location.href='test.html';
  },
  handleAdd: function() {
    alert('按钮被点了一下');
  },
  render: function() {
    return (
        <li className="item" onClick={this.handlerJump}>
        <div className="item-l"><div className="fl"> <img src="images/header.jpg" className="avatar"/></div>
        <div className="item-r">
        <div className="msg"><strong>{this.props.author}</strong><span>{new Date().toLocaleString()}</span></div>
        <div className="content"> {this.props.children}</div>
        </div>
        </div>
        <div className="mybtns"><button className="mybtn" onClick={this.handleAdd}>按钮</button></div>
        </li>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    if (this.props.data) {
      var commentNodes = this.props.data.map(function (comment) {
        return (
            <Comment author={comment.author}>
            {comment.text}
          </Comment>
        );
      });
    }

    return (
        <div className="commentList">
        {commentNodes}

      </div>
    );
  }
});

var CommentBox = React.createClass({
  getInitialState: function() {
    return {data: [{author: "", text: ""}]};
  },
  getComments: function() {
    var success = function() {
      var data = [
        {author: "Pete Hunt", text: "This is one comment"},
        {author: "Jordan Walke", text: "This is two comment"},
        {author: "Pete Hunt2", text: "This is one comment"},
        {author: "Jordan Walke2", text: "This is two comment"},
        {author: "Pete Hunt", text: "This is one comment"},
        {author: "Jordan Walke", text: "This is two comment"},
        {author: "Pete Hunt2", text: "This is one comment"},
        {author: "Jordan Walke2", text: "This is two comment"}
      ];
      this.setState({data: data});
    }.bind(this);
    setTimeout(success, 100);
  },
  componentWillMount: function() {
    this.getComments();
  },
  render: function() {
    return (
        <div className="commentBox">
        {/*<CommentList data={this.props.data} />*/}
        <CommentList data={this.state.data} />
        </div>
    );
  }
});

module.exports = CommentBox;
