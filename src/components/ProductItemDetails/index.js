import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
  initial: 'INITIAL',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
    productData: {},
    similarProductData: [],
  }

  getFormattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    Rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  ComponentDidMount = () => {
    this.getProductsData()
  }

  getProductsData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/:${id}`
    const options = {
      header: {
        Authorization: `Bearer${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData)
      const updatedSimilarProductsData = fetchedData.similar_products.map(
        eachSimilarProducts => this.getFormattedData(eachSimilarProducts),
      )
      this.setState({
        similarProductData: updatedSimilarProductsData,
        productData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setStat({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="products-details-loader-container">
      <Loader type="threeDots" color="#3b82f6" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="products-details-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png "
        alt=" products failure"
        className="failure-image-view"
      />
      <h1 className="Product-not-found-heading"> Product Not Found</h1>
      <button type="button" className="button">
        Continue Shopping
      </button>
    </div>
  )

  renderProductsDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView
      case apiStatusConstants.inProgress:
        return this.renderLoadingView
      default:
        return null
    }
  }

  render() {
    return <Header />
  }
}

export default ProductItemDetails
