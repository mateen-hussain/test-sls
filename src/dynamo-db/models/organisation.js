import dynamoose from '../index'

const OrganisationSchema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true
  },
  name: {
    type: String,
    required: true
  },
  yearFounded: {
    type: Number,
    required: true
  },
  revenue: {
    type: Number
  },
  parentId: {
    type: String
  }
}, {
  timestamps: false
})

export default dynamoose.model(process.env.TABLE_ORGANISATION, OrganisationSchema)
