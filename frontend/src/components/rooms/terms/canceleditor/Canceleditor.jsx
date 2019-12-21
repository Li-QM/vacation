import React from 'react';
import MyStatefulEditor from '../../mystatefuleditor/MyStatefulEditor';

// import { connect } from 'react-redux';
// import { renderSidebarAction, renderStopSidebarAction } from '../../../../../actions/managelisting/renderSidebarAction'


class Canceleditor extends React.Component {
  // constructor(props) {
  //   super(props)
  // }
  componentDidMount() {
    
  }
  render() {
    return (
      <div className="base_priceamt row">
        <div className="base_decs col-12">
          <h3>Cancellation Policy</h3>
        </div>
        <div className="base_text_container col-12">
          <div className="col-md-12 base_amut">
            <MyStatefulEditor 
              value={this.props.value ? this.props.value : ''}
              onChange={value => this.props.onChange(value)} 
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Canceleditor;