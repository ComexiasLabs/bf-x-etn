import type { NextPage } from 'next';
import styles from '../styles/Home.module.scss';
import PageHead from '../components/templates/PageHead/PageHead';
import { Button, Col, Container, Row, Card, Carousel } from 'react-bootstrap';
import Navigation from '@components/molecules/Navigation/Navigation';
import Footer from '@components/templates/Footer/Footer';
import { Blockchains } from '@core/enums/blockchains';
import { useState } from 'react';
import SelectBlockchainDialog from '@components/dialogs/SelectBlockchainDialog/SelectBlockchainDialog';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import BarChartIcon from '@mui/icons-material/BarChart';
import GitHubIcon from '@mui/icons-material/GitHub';
import { TextField, styled } from '@mui/material';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { trackGAEvent } from '@modules/analytics/ga';

const MainLanding: NextPage = () => {
  const [enterApp, setEnterApp] = useState<boolean>(false);

  const handleEnterApp = async () => {
    trackGAEvent('Button', 'Click', 'Landing - Enter App');
    setEnterApp(true);
  };

  const handleViewDemo = async () => {
    trackGAEvent('Button', 'Click', 'Landing - View Demo');
    location.href = '/app';
  };

  const handleOnSelectBlockchain = async (blockchain: Blockchains) => {
    trackGAEvent('Button', 'Click', `Landing - Select Blockchain - ${blockchain}`);
    setEnterApp(false);
    if (blockchain === Blockchains.Fantom) {
      location.href = '/fantom/app/';
    }
    if (blockchain === Blockchains.BNBChain) {
      location.href = '/bsc/app/';
    }
    if (blockchain === Blockchains.TRON) {
      location.href = '/tron/app/';
    }
    if (blockchain === Blockchains.Areon) {
      location.href = '/areon/app/';
    }
    if (blockchain === Blockchains.Electroneum) {
      location.href = '/electroneum/app/';
    }
  };

  const GithubTextField = styled(TextField)({
    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
      },
      '& input': {
        color: 'white',
      },
      '& .MuiSvgIcon-root': {
        color: 'white',
      },
    },
  });

  return (
    <div className={styles.container}>
      <PageHead />
      <Navigation />
      <main className={styles.main}>
        <Container fluid>
          <Row className={styles.intro}>
            <Col md={1} sm={12}></Col>
            <Col md={6} sm={12}>
              <div className={styles.introContainer}>
                <h1>
                  <div className={styles.mainTitle}>Blockchain dapp development studio</div>
                </h1>
                <div className={styles.subtitle}>
                  Build <ChevronRightIcon /> Deploy <ChevronRightIcon /> Measure
                </div>
                <p>
                  Block Fabric is an AI driven all-in-one platform that helps you create, deploy, manage and monitor
                  smart contracts across various blockchains.
                </p>
                <div style={{ paddingTop: 30 }}>
                  <Button className={styles.buttonHighlight} onClick={() => handleViewDemo()}>
                    Live Demo
                  </Button>

                  <Button className={styles.buttonDefault} onClick={() => handleEnterApp()}>
                    Connect Wallet
                  </Button>
                </div>
              </div>
            </Col>
            <Col md={5} sm={12}>
              <div className="intro-illustration">
                <img src="/assets/illustrations/bf-blocks.png" alt="" />
              </div>
            </Col>
          </Row>
        </Container>

        {/* Feature overview */}
        <Container id="learn-more">
          <div style={{ background: '#ffffff', borderRadius: '20px' }} className="mt-5 mb-5">
            <Row className="section-container advanced-section">
              <Col lg={7} md={12} sm={12}>
                <Carousel>
                  <Carousel.Item>
                    <div className="feature-image">
                      <img
                        src="/assets/images/screenshot-create-app-details.png"
                        alt="screenshot"
                        className="framed-image"
                      />
                    </div>
                  </Carousel.Item>
                  <Carousel.Item>
                    <div className="feature-image">
                      <img src="/assets/images/screenshot-deploy.png" alt="screenshot" className="framed-image" />
                    </div>
                  </Carousel.Item>
                  <Carousel.Item>
                    <div className="feature-image">
                      <img src="/assets/images/screenshot-app-details.png" alt="screenshot" className="framed-image" />
                    </div>
                  </Carousel.Item>
                  <Carousel.Item>
                    <div className="feature-image">
                      <img src="/assets/images/screenshot-app-function.png" alt="screenshot" className="framed-image" />
                    </div>
                  </Carousel.Item>
                  <Carousel.Item>
                    <div className="feature-image">
                      <img src="/assets/images/screenshot-app-code.png" alt="screenshot" className="framed-image" />
                    </div>
                  </Carousel.Item>
                  <Carousel.Item>
                    <div className="feature-image">
                      <img
                        src="/assets/images/screenshot-create-template.png"
                        alt="screenshot"
                        className="framed-image"
                      />
                    </div>
                  </Carousel.Item>
                  <Carousel.Item>
                    <div className="feature-image">
                      <img src="/assets/images/screenshot-storage-2.png" alt="screenshot" className="framed-image" />
                    </div>
                  </Carousel.Item>
                  <Carousel.Item>
                    <div className="feature-image">
                      <img src="/assets/images/screenshot-analytics.png" alt="screenshot" className="framed-image" />
                    </div>
                  </Carousel.Item>
                </Carousel>
              </Col>
              <Col lg={5} md={12} sm={12}>
                <div className="advanced-description">
                  <h2>AI driven all-in-one platform for building and managing dapps</h2>
                  <h3 className="muted">Just connect your wallet and you're good to go.</h3>
                  <p className="paragraph">
                    Block Fabric makes dapp creation a breeze. Create smart contracts using preset templates without
                    code, or import your existing contracts. Manage your dapps centrally, and leverage robust analytics
                    for insightful app performance.
                  </p>
                </div>
                <div className="brand-logo-container">
                  <img
                    src="/assets/brands/electroneum-logo-dark-horizontal.png"
                    alt="ELECTRONEUM"
                    className="brand-logo"
                  />
                  <img src="/assets/brands/tron-logo-horizontal.png" alt="TRON" className="brand-logo" />
                  <img src="/assets/brands/bnb-chain-text-logo.svg" alt="BNB Chain" className="brand-logo" />
                  <img src="/assets/brands/fantom-logo-horizontal.png" alt="fantom" className="brand-logo" />
                  <img
                    src="/assets/brands/areon-logo-horizontal.png"
                    alt="Areon"
                    className="brand-logo"
                    style={{ maxHeight: 50 }}
                  />
                </div>
              </Col>
            </Row>
          </div>
        </Container>

        {/* GitHub Integration */}
        <Container id="github">
          <Row className="section-container" style={{ minHeight: 'auto' }}>
            <Col md={12} sm={12}>
              <div className="github-brand-image">
                <GitHubIcon />
              </div>
              <h2 className="section-heading"> Launch smart contracts directly from GitHub</h2>
              <p className="section-subheading">Build and deploy your app directly from your GitHub repository</p>
              <GithubTextField
                fullWidth
                label=""
                variant="outlined"
                placeholder="https:// your github repo url"
                InputProps={{
                  endAdornment: (
                    <Button variant="contained" color="primary">
                      <ArrowRightAltIcon />
                    </Button>
                  ),
                }}
                sx={{
                  width: { xs: '100%', md: '70%' },
                  marginTop: '24px',
                }}
              />
            </Col>
          </Row>
        </Container>

        {/* No Code Templates */}
        <Container id="templates">
          <Row className="section-container" style={{ minHeight: 'auto' }}>
            <Col md={12} sm={12}>
              <h2 className="section-heading">Build with No Code Templates</h2>
              <p className="section-subheading">
                Build your contract from a growing collection of preset templates you can use and customize
              </p>
            </Col>
          </Row>
          <Row className="feature-cards">
            <Col xs={12} sm={6} md={6} lg={3} className="feature-card template">
              <Card body>
                <Card.Title>Token</Card.Title>
                <Card.Subtitle className="mb-2">ERC20 standard token contract used for transactions.</Card.Subtitle>
                <div className="mt-2 card-subtitle small" style={{ color: '#565656' }}>
                  Template by BlockFabric
                </div>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={6} lg={3} className="feature-card template">
              <Card body>
                <Card.Title>NFT</Card.Title>
                <Card.Subtitle className="mb-2">
                  ERC721 standard NFT contract to house a collection of unique assets.
                </Card.Subtitle>
                <div className="mt-2 card-subtitle small" style={{ color: '#565656' }}>
                  Template by BlockFabric
                </div>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={6} lg={3} className="feature-card template">
              <Card body>
                <Card.Title>One-Time Subscription</Card.Title>
                <Card.Subtitle className="mb-2">Accept one time payments for product subscription.</Card.Subtitle>
                <div className="mt-2 card-subtitle small" style={{ color: '#565656' }}>
                  Template by BlockFabric
                </div>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={6} lg={3} className="feature-card template">
              <Card body>
                <Card.Title>ICO Crowd Sale</Card.Title>
                <Card.Subtitle className="mb-2">
                  Launch initial coin offering and crowd sale for your token.
                </Card.Subtitle>
                <div className="mt-2 card-subtitle small" style={{ color: '#565656' }}>
                  Template by BlockFabric
                </div>
              </Card>
            </Col>
          </Row>
          <Row className="section-container" style={{ minHeight: 'auto' }}>
            <Col md={12} sm={12}>
              <p className="section-subheading">
                <a href="https://github.com/ComexiasLab/blockfabric-templates">
                  View the open source collection of templates <ChevronRightIcon />
                </a>
              </p>
            </Col>
          </Row>
        </Container>

        {/* AI */}
        <Container id="ai">
          <div style={{ border: 'solid 1px #9976b7', borderRadius: '20px' }} className="mt-5 mb-5">
            <Row className="section-container advanced-section">
              <Col lg={5} md={12} sm={12}>
                <div className="advanced-description">
                  <h2 style={{ color: 'white' }}>AI Security and Code Review</h2>
                  <p className="paragraph">
                    Block Fabric's advanced AI security and code review analysis automatically scans your smart contract
                    codes using industry leading AI models to ensure unparalleled security and integrity.
                  </p>
                </div>
                <div>
                  <small style={{ color: '#c7c7c7' }}>Powered by</small>
                  <img src="/assets/ai/anthropic_24x24.svg" alt="anthropic" className="brand-logo-small white-svg" />
                  <img src="/assets/ai/amazon_24x24.svg" alt="amazon" className="brand-logo-small" />
                  <img src="/assets/ai/cohere_24x24.svg" alt="cohere" className="brand-logo-small" />
                  <img src="/assets/ai/ai21_24x24.svg" alt="ai21" className="brand-logo-small" />
                  <img src="/assets/ai/meta_24x24.svg" alt="meta" className="brand-logo-small" />
                  <img src="/assets/ai/mistral_24x24.svg" alt="mistral" className="brand-logo-small" />
                  <img src="/assets/ai/google_24x24.svg" alt="google" className="brand-logo-small" />
                </div>
              </Col>
              <Col lg={7} md={12} sm={12}>
                <div className="feature-image">
                  <img src="/assets/images/screenshot-ai-models.png" alt="screenshot" className="framed-image" />
                </div>
              </Col>
            </Row>
          </div>
        </Container>

        {/* Analytics Dashboard */}
        <Container id="analytics">
          <div className="mt-5 mb-5">
            <Row className="section-container advanced-section">
              <Col lg={7} md={12} sm={12}>
                <div className="feature-image">
                  <img
                    src="/assets/images/screenshot-analytics-2.png"
                    alt="screenshot"
                    className="framed-image"
                    style={{ borderColor: '#fff' }}
                  />
                </div>
              </Col>
              <Col lg={5} md={12} sm={12}>
                <div className="advanced-description">
                  <h2 style={{ color: 'white' }}>
                    <BarChartIcon color="warning" style={{ fontSize: 60 }} /> Smart Contract Analytics
                  </h2>
                  <h3 className="muted">See insights and understand how people interact with your dapp.</h3>
                  <p className="paragraph">
                    With Block Fabric, dive deep into user interactions, tracking smart contract usage and trends.
                    Enhance dapp performance and user experience through precise data-driven insights.
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        </Container>

        {/* Contract Import */}
        <Container id="existing-contracts">
          <div style={{ border: 'solid 1px #637db3', borderRadius: '20px' }} className="mt-5 mb-5">
            <Row className="section-container advanced-section">
              <Col lg={5} md={12} sm={12}>
                <div className="advanced-description">
                  <h2 style={{ color: 'white' }}>Works with Existing Contracts</h2>
                  <h3 className="muted">Easily import contracts already active on the blockchain.</h3>
                  <p className="paragraph">
                    Block Fabric seamlessly incorporates your pre-deployed contracts, ensuring smooth transitions and
                    uninterrupted operations. Maximize your blockchain efforts without starting from scratch.
                  </p>
                </div>
              </Col>
              <Col lg={7} md={12} sm={12}>
                <div className="feature-image">
                  <img src="/assets/images/screenshot-import-contract.png" alt="screenshot" className="framed-image" />
                </div>
              </Col>
            </Row>
          </div>
        </Container>

        {/* More Features */}
        {/* <Container>
          <Row id="features" className="section-container" style={{ minHeight: 'auto' }}>
            <Col md={12} sm={12}>
              <h2 className="section-heading">More Features</h2>
            </Col>
          </Row>
          <Row className="feature-cards">
            <Col xs={12} sm={6} md={6} lg={3} className="feature-card">
              <Card body>
                <CodeIcon className="feature-icon" />
                <Card.Title>Custom Code</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Can't find the right template? Write your own code!
                </Card.Subtitle>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={6} lg={3} className="feature-card">
              <Card body>
                <ArrowDownwardIcon className="feature-icon" />
                <Card.Title>Contract Import</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Import existing contracts which have been previously deployed so you can manage them together.
                </Card.Subtitle>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={6} lg={3} className="feature-card">
              <Card body>
                <SpeedIcon className="feature-icon" />
                <Card.Title>Dashboard & Analytics</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  See details and statistics for your deployed contracts on the blockchain.
                </Card.Subtitle>
              </Card>
            </Col>
          </Row>
        </Container> */}

        {/* Pricing */}
        <Container id="pricing">
          <Row className="section-container" style={{ minHeight: 'auto', marginTop: '60px' }}>
            <Col md={12} sm={12}>
              <h2 className="section-heading">Pricing</h2>
              <h4 className="usability-subtitle">We keep things free for as much as we can</h4>
            </Col>
          </Row>
          {/* TODO: update pricing table */}
          <Row className="pricing-cards">
            <Col xs={12} sm={6} md={6} lg={4} className="pricing-card">
              <Card body>
                <Card.Title>
                  <p>Beta Preview</p>
                </Card.Title>
                <hr />
                <Card.Subtitle className="mb-4" style={{ textAlign: 'center' }}>
                  <h6>Beta Features</h6>
                </Card.Subtitle>
                <Card.Subtitle className="mb-2">
                  <ul className="pricing-list">
                    <li>
                      <i>Available now</i>
                    </li>
                    <li>Unlimited apps</li>
                    <li>Full experimental features</li>
                  </ul>
                  <hr />
                  Features are ongoing development and experimental.
                </Card.Subtitle>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={6} lg={4} className="pricing-card">
              <Card body>
                <Card.Title>
                  <p>Standard</p>
                </Card.Title>
                <hr />
                <Card.Subtitle className="mb-4" style={{ textAlign: 'center' }}>
                  <h6>FREE</h6>
                </Card.Subtitle>
                <Card.Subtitle className="mb-2">
                  <ul className="pricing-list">
                    <li>
                      <i>Available soon</i>
                    </li>
                    <li>Up to 2 apps</li>
                    <li>Basic Analytics</li>
                    <li>Public GitHub Repo</li>
                    <li>Standard AI Code Review</li>
                    <li>Standard AI Security Review</li>
                  </ul>
                  <hr />
                  Stable release.
                </Card.Subtitle>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={6} lg={4} className="pricing-card">
              <Card body>
                <Card.Title>
                  <p>Pro</p>
                </Card.Title>
                <hr />
                <Card.Subtitle className="mb-4" style={{ textAlign: 'center' }}>
                  <h6>To be announced</h6>
                </Card.Subtitle>
                <Card.Subtitle className="mb-2">
                  <ul className="pricing-list">
                    <li>
                      <i>Available soon</i>
                    </li>
                    <li>Unlimited apps</li>
                    <li>Advanced Analytics</li>
                    <li>Public & Private GitHub Repo</li>
                    <li>Customizable AI Code Review</li>
                    <li>Customizable AI Security Review</li>
                    <li>App versioning</li>
                  </ul>
                  <hr />
                  Stable release.
                </Card.Subtitle>
              </Card>
            </Col>
          </Row>
        </Container>

        <Container id="beta">
          <div style={{ background: '#c4e2d2', marginTop: '120px' }}>
            <Row className="section-container advanced-section">
              <Col md={1} sm={1}></Col>
              <Col md={5} sm={5}>
                <div className="advanced-description">
                  <h2>Early Access Beta Preview</h2>
                  <p className="paragraph">
                    Be among the first to experience our beta preview and experience a new way of creating and deploying
                    smart contracts. We welcome your valuable feedback as it can significantly shape Block Fabric's
                    future.{' '}
                  </p>
                </div>
                <div>
                  <Button className={styles.buttonHighlight} onClick={() => handleEnterApp()}>
                    Try the Beta
                  </Button>
                </div>
              </Col>
              <Col md={5} sm={5}>
                <div className="illustration">
                  <img src="/assets/illustrations/37.svg" alt="" />
                </div>
              </Col>
            </Row>
          </div>
        </Container>
        <Footer />
      </main>
      {enterApp && (
        <SelectBlockchainDialog
          show={true}
          onCancel={() => setEnterApp(false)}
          onSelect={(blockchain: Blockchains) => handleOnSelectBlockchain(blockchain)}
        />
      )}
    </div>
  );
};

export const getServerSideProps = async (context: any) => {
  return {
    props: {},
  };
};

export default MainLanding;
