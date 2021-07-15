import React, { PureComponent } from "react";
import { Upload, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

class ManualUpload extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fileList: props.fileList || [],
      files: [],
      previewModal: false,
      previewUrl: "",
    };
  }
  handlePreview = (file) => {
    this.setState({
      previewModal: true,
      previewUrl: file.thumbUrl,
    });
  };
  handleCloseModal = () => {
    this.setState({
      previewModal: false,
    });
  };
  render() {
    const {
      multiple = true,
      buttonTitle = "上传图片",
      showUploadList = true,
    } = this.props;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div>{buttonTitle}</div>
      </div>
    );
    const props = {
      onRemove: (file) => {
        const index = this.state.fileList.indexOf(file);
        const newFileList = this.state.fileList.slice();
        newFileList.splice(index, 1);
        this.props.onChange && this.props.onChange(newFileList);
        this.setState({
          fileList: newFileList,
          files: newFileList,
        });
      },
      beforeUpload: (file) => {
        let count = [];
        let files = [];
        if (showUploadList) {
          files = this.state.files;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          file.thumbUrl = e.target.result;
          files.push(file);
          files.map((item, index) => {
            if (file.name === item.name) {
              count.push(index);
              if (count.length > 1) {
                message.error("文件已存在!");
                files.splice(index, 1);
                return;
              }
            }
            return null;
          });
          this.setState({
            fileList: [...files],
          });
          this.props.onChange && this.props.onChange(this.state.fileList);
        };
        return false;
      },
      onPreview: this.handlePreview,
      fileList: showUploadList ? this.state.fileList : null,
      listType: "picture-card",
      multiple: multiple,
      showUploadList: showUploadList,
    };
    return (
      <div>
        <Upload {...props}>
          {!showUploadList && this.state.fileList.length >= 1 ? (
            <img
              src={this.state.fileList[0].thumbUrl}
              style={{ width: 86, height: 86 }}
            />
          ) : (
            uploadButton
          )}
        </Upload>
        <Modal
          visible={this.state.previewModal}
          footer={null}
          onCancel={this.handleCloseModal}
        >
          <img style={{ width: "100%" }} src={this.state.previewUrl} />
        </Modal>
      </div>
    );
  }
}
export default ManualUpload;
