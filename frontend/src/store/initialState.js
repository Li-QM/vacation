export const eMediaTypes = {
  video: 'Video',
  slider: 'Slider'
};

export const initialState = {
  entities: {
    users: {}
  },
  session: {
    currentUser: null
  },
  flashMessages: {},
  requests: {},

  header: {

  },

  footer: {

  },

  home: {
    carousel: {
      mediaType: eMediaTypes.slider,  // one of eMediaTypes
      slider: [
        {imageUrl: '', title: ''}
      ],
      video: [

      ]
    },

    home_city: [],

    


  }


}
