import React from "react";

import { Editor } from '@tinymce/tinymce-react';

class MyStatefulEditor extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <Editor
        apiKey='zoduyhntark226lat2rbbhfpxzhx8srm6x7zshbg4d3p9k8p'
        initialValue="<p>This is the initial content of the editor</p>"
        init={{
          height: '300px',
          maxHeight: '300px',
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
          ],
          toolbar:
            'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help '
        }}
        value={this.props.value}
        onChange={event => this.props.onChange(event.target.getContent())}
        name={this.props.name ? this.props.name : "texteditor_for_description"}
       />
    );
  }
}

export default MyStatefulEditor;
