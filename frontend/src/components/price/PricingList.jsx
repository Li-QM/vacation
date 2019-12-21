import React from 'react'

class PricingList extends React.PureComponent {
  // constructor(props) {
  //   super(props)
  // }
  render () {
    return (
      <tr className="compare-row">
        <td>{this.props.title}</td>
        {
          this.props.types.map((type, index) => {
            return <td key={index}><span className="tickblue">{type[this.props.attribute] ? '✔' : '-'}</span></td>
          })
        }
      </tr>
    );
  }
}

export default PricingList;