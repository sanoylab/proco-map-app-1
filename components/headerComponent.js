import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signin, signout, useSession } from 'next-auth/client'
import { Navbar, Nav, NavItem, Dropdown, Button } from 'react-bootstrap'

import './headerComponent.module.css'

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <button
        className="custom-dropdown-toggle"
        ref={ref}
        onClick={(e) => {
            e.preventDefault()
            onClick(e)
        }}
    >
        <div className="dropdown-toggle-content">
            <div>{children}</div>
            <img src="white.svg" className="dropdown-toggle-caret" />
        </div>
    </button>
))

const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
        return (
            <div
                ref={ref}
                style={style}
                className={className}
                aria-labelledby={labeledBy}
            >
                <ul className="custom-dropdown-list">
                    {React.Children.toArray(children)}
                </ul>
            </div>
        )
    },
)

const Header = () => {
    const [session, loading] = useSession()
    const router = useRouter()

    // Redirect to landing page if on authorized-only page
    const signOutWithRedirect = async () => {
        signout()

        if (router.asPath.startsWith('/profile')) {
            router.push('/')
        }
    }

    return (
        <Navbar className="justify-content-between">
            <Link href="/">
                <a className="masthead-brand">Project Connect</a>
            </Link>
            <Nav style={{ height: 100 + '%' }}>
                {!session && !loading && (
                    <NavItem className="signin-button" onClick={signin}>
                        Sign In
                    </NavItem>
                )}
                {session && !loading && (
                    <Dropdown as={NavItem}>
                        <Dropdown.Toggle
                            as={CustomToggle}
                            id="custom-dropdown-toggle"
                        >
                            {session.user.name.split(' ')[0]}
                        </Dropdown.Toggle>
                        <Dropdown.Menu as={CustomMenu} align="right">
                            <Dropdown.Item
                                as={Link}
                                href="/profile"
                                className="profile-link"
                            >
                                <a className="dropdown-item profile-link">
                                    My Profile
                                    <img
                                        src="./blue.svg"
                                        className="dropdown-caret"
                                    ></img>
                                </a>
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                                className="signout-button"
                                onClick={() => signOutWithRedirect()}
                            >
                                Sign Out
                                <img
                                    src="caret-red.svg"
                                    className="dropdown-caret"
                                ></img>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                )}
            </Nav>
        </Navbar>
    )
}

export default Header
