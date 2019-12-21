import React from 'react'
class AmenitiestList extends React.Component {
  // constructor(props) {
  //   super(props)
  // }
  render() {
    let amenitiesList = this.props.amenities_type.map((type) => {
      let products_list = this.props.amenities.map((amenity) => {
        if (type.id === amenity.type_id) {
          return <div className="col-md-6" key={amenity.id}>
            <div className="label-large label-inline amenity-label pos-rel">
              <input type="checkbox" onChange={this.props.onChange} className="comint" name="amenities" defaultChecked={this.props.prev_amenities.includes(amenity.id.toString())} value={amenity.id} />
              <span className="comspn">{amenity.name}</span>
            </div>
          </div>
        }
        return null;
      })
      return <div className="amenites_list" key={type.id}>
        <div className="amenities_left">
          <h3>{type.name}</h3>
        </div>
        <div className="amenities_right">
          <div className="row amenitie_poduct">
            {products_list}
          </div>
        </div>
      </div>
    })
    return <div style={{ position: 'unset' }}>{amenitiesList}</div>
  }
}

export default AmenitiestList;