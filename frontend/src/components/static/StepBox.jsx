import React from 'react'

export class StepBox extends React.PureComponent{
  // constructor(props){
  //   super(props)
  // }
  render() {
    if(this.props.mode === 4) {
      return (
        <div className="row">
          <div className="col-sm-12 col-md-12">
            {/* Steps boxes element mode 4 - icons mode */}
            <div className="step-boxes-4">
              {/* Step #1 */}
              <div className="process_box4">
                {/* Title */}
                <h4 className="stp_title"> Search </h4>
                {/* Bubble wrapper */}
                <div className="pb__line">
                  {/* Number/Icon */}
                  <div className="number">
                    {/* Icon = .icon-gi-ico-10 */}
                    <span className="icon-gi-ico-10" />
                  </div>
                </div>
                {/*/ Bubble wrapper */}
                {/* Content */}
                <div className="content">
                  {/* Description */}
                  <p> Search for the perfect vacation home for rent from our verified listings </p>
                  {/*/ Description */}
                </div>
                {/*/ Content */}
                <div className="clear" />
              </div>
              {/*/ Step #1 */}
              {/* Step #2 */}
              <div className="process_box4">
                {/* Title */}
                <h4 className="stp_title"> Make an inquiry </h4>
                {/*/ Title */}
                {/* Bubble wrapper */}
                <div className="pb__line">
                  {/* Number/Icon */}
                  <div className="number">
                    {/* Icon = .icon-gi-ico-9 */}
                      <span className="icon-gi-ico-9" />
                  </div>
                </div>
                {/*/ Bubble wrapper */}
                {/* Content */}
                <div className="content">
                  {/* Description */}
                  <p> Contact the owner or property manager directly </p>
                  {/*/ Description */}
                </div>
                {/*/ Content */}
                <div className="clear" />
              </div>
              {/*/ Step #2 */}
              {/* Step #3 last */}
              <div className="process_box4 last">
                {/* Title */}
                <h4 className="stp_title"> Make the booking </h4>
                {/*/ Title */}
                {/* Bubble wrapper */}
                <div className="pb__line">
                  {/* Number/Icon */}
                  <div className="number">
                    {/* Icon = .icon-gi-ico-8 */}
                    <span className="icon-gi-ico-8" />
                  </div>
                </div>
                {/*/ Bubble wrapper */}
                {/* Content */}
                <div className="content">
                  {/* Description */}
                  <p> Once you have settled on the home of your choice, book direct with the homeowner or property manager </p>
                  {/*/ Description */}
                </div>
                {/*/ Content */}
                <div className="clear" />
              </div>
              {/*/ Step #3 last */}
            </div>
            {/*/ Steps boxes element #4 - icons mode */}
          </div>
        {/*/ col-sm-12 col-md-12 */}
        </div>
      )
    }
  }
}

// export default StepBox;