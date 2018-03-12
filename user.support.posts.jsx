const React = require('react')
const supportPostService = require('../../services/support.posts.service')
const usersService = require('../../services/users.service')
const SupportPost = require('../shared/support.post.form')

class UserSupportPosts extends React.PureComponent {
    constructor(props, context) {
        super(props, context)
        this.state = {
            supportPosts: [],
            firstName: '',
            lastName: '',
            imageUrl: '',
            supporters: [],
            users:[]

        }

        this.onCreate = this.onCreate.bind(this)
    }
    componentDidMount() {

        supportPostService.readByClientId(this.props.userId)
            .then(response => {
                this.setState({
                    supportPosts: response.item

                })
            })
            .catch(err => console.warn(err))

        usersService.readById(this.props.userId)
            .then(response => {
                this.setState({
                    firstName: response.item.firstName,
                    lastName: response.item.lastName,
                    image: response.item.imageUrl

                })
            })
            .catch(err => console.warn(err))

        usersService.readSupportersById(this.props.userId)
            .then(response => {
                this.setState({ supporters: response.data.items })
            })
            .catch(err => console.warn(err))
    }

    onCreate(data, user) {
        let copy = this.state.supportPosts.slice()
        let userCopy = this.state.users.slice()
        copy.push(data)
        userCopy.push(data)
        this.setState({
            supportPosts: copy,
            users: userCopy
        })
    }

    render() {

        let Potato = this.state.supportPosts.map(apple => (

            <li key={apple._id} className="left">

                <span className="date-time">{apple.dateCreated}</span>

                <a href="javascript:;" className="name">{this.props.userId}</a>

                <a href="javascript:;" className="image"><img alt="" src={this.state.image} /></a>

                <div className="message" dangerouslySetInnerHTML={{ __html: apple.contentHtml }} ></div>

            </li>
        ))
        return (
            <div>

                <div className="profile-section">
                    <div className="row">
                        <div className="col-md-4 col-md-offset-4">
                            <h4 className="title">Message </h4>
                            <div data-scrollbar="true" data-height="280px" className="bg-silver">
                                <ul className="chats">
                                    {Potato}
                                </ul>
                            </div>
                <SupportPost userId={this.props.userId} supporters={this.state.supporters} onCreate={this.onCreate}></SupportPost>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

module.exports = UserSupportPosts
