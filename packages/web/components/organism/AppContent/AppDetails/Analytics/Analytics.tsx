import React, { useContext, useEffect, useState } from 'react';
import styles from './Analytics.module.scss';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Card,
  CardContent,
  IconButton,
  MenuItem,
  Select,
  Skeleton,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
  Button,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { App } from '@modules/firebase';
import BarChartIcon from '@mui/icons-material/BarChart';
import useCheckContracts from 'hooks/useCheckContracts';
import { Blockchains } from '@core/enums/blockchains';
import { Environments } from '@core/enums/environments';
import { getDeploymentForEnvironment } from '@core/helpers/appHelper';
import { fetchAnalyticsTransactions, refreshAnalytics } from '@services/web/analyticsService';
import { AnalyticsTransaction } from '@modules/firebase';
import { convertDaysToSeconds, formatDate, getCurrentTimestampInSeconds } from '@core/helpers/datetimeHelper';
import { shortenHash } from '@modules/blockchains/blockchainHelper';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getExplorerAddressUrl, getExplorerTxUrl } from '@modules/blockchains/blockchains';

interface ChartDataItem {
  name: string;
  value: number;
}

interface AnalyticsProps {
  app: App;
  blockchain: Blockchains;
  isDemo: boolean;
}

export default function Analytics({ app, blockchain, isDemo }: AnalyticsProps) {
  const {
    isLoading: isCheckContractsLoading,
    isTestnetDeployed,
    isMainnetDeployed,
    updatedApp,
  } = useCheckContracts(app, blockchain, isDemo);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = React.useState<Environments>(null);
  const [selectedContractAddress, setSelectedContractAddress] = React.useState<string>();
  const [selectedTimeFrame, setSelectedTimeFrame] = useState(30);
  const [transactions, setTransactions] = useState<AnalyticsTransaction[]>([]);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);

  const handleSelectEnvironment = (event: React.MouseEvent<HTMLElement>, environment: Environments | null) => {
    setSelectedEnvironment(environment);

    const deployment = getDeploymentForEnvironment(app, environment);
    setSelectedContractAddress(deployment?.contractAddress);
  };

  const handleTimeFrameChange = (event) => {
    setSelectedTimeFrame(event.target.value);
  };

  const loadAnalytics = async () => {
    if (selectedEnvironment) {
      setIsLoading(true);

      if (!isDemo) {
        await refreshAnalytics({
          appId: app.appId,
          blockchain,
          contractAddress: selectedContractAddress,
          environment: selectedEnvironment,
        });
      }

      const currentTime = getCurrentTimestampInSeconds();
      const startTimestamp = selectedTimeFrame === 0 ? 0 : currentTime - convertDaysToSeconds(selectedTimeFrame);
      const transactions = await fetchAnalyticsTransactions({
        appId: app.appId,
        blockchain,
        contractAddress: selectedContractAddress,
        environment: selectedEnvironment,
        startTimestamp: startTimestamp,
        endTimestamp: currentTime,
      });

      // Sort transactions by dateTimeUTC in descending order
      transactions.sort((a, b) => b.dateTimeUTC - a.dateTimeUTC);

      setTransactions(transactions);
      setChartData(generateChartData(transactions, selectedTimeFrame));
      setIsLoading(false);
    }
  };

  const generateChartData = (transactions: AnalyticsTransaction[], timeFrame: number): ChartDataItem[] => {
    const result: ChartDataItem[] = [];
    const currentDate = new Date();

    if (timeFrame === 0) {
      // Use a Set to ensure we only process each month-year combination once.
      const processedMonths = new Set<string>();

      transactions.forEach((tx) => {
        const txDate = new Date(tx.dateTimeUTC * 1000);
        const monthYear = `${txDate.getUTCMonth()}-${txDate.getUTCFullYear()}`;

        if (!processedMonths.has(monthYear)) {
          processedMonths.add(monthYear);

          const monthTransactions = transactions.filter((innerTx) => {
            const innerTxDate = new Date(innerTx.dateTimeUTC * 1000);
            return (
              innerTxDate.getUTCMonth() === txDate.getUTCMonth() &&
              innerTxDate.getUTCFullYear() === txDate.getUTCFullYear()
            );
          });

          result.push({
            name: `${txDate.toLocaleString('default', { month: 'short' })} ${txDate.getUTCFullYear()}`,
            value: monthTransactions.length,
          });
        }
      });

      // Sort the result based on months in ascending order
      result.sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
    } else {
      for (let i = timeFrame - 1; i >= 0; i--) {
        const targetDate = new Date(currentDate.getTime() - i * 24 * 60 * 60 * 1000);
        const dayTransactions = transactions.filter((tx) => {
          const txDate = new Date(tx.dateTimeUTC * 1000);
          return (
            txDate.getUTCDate() === targetDate.getUTCDate() &&
            txDate.getUTCMonth() === targetDate.getUTCMonth() &&
            txDate.getUTCFullYear() === targetDate.getUTCFullYear()
          );
        });

        result.push({
          name: `${targetDate.getUTCFullYear()}-${(targetDate.getUTCMonth() + 1)
            .toString()
            .padStart(2, '0')}-${targetDate.getUTCDate().toString().padStart(2, '0')}`,
          value: dayTransactions.length,
        });
      }
    }

    return result;
  };

  useEffect(() => {
    setIsLoading(false);
    setSelectedEnvironment(null);
    setSelectedContractAddress(null);
    setSelectedTimeFrame(30);
    setTransactions([]);
    setChartData([]);
  }, [app]);

  useEffect(() => {
    loadAnalytics();
  }, [selectedEnvironment, selectedContractAddress, selectedTimeFrame]);

  return (
    <div className={styles.container}>
      <div className={styles.controlsWrapper}>
        <div>
          <ToggleButtonGroup value={selectedEnvironment} exclusive onChange={handleSelectEnvironment}>
            <ToggleButton value={Environments.Testnet} disabled={!isTestnetDeployed}>
              Testnet
            </ToggleButton>
            <ToggleButton value={Environments.Mainnet} disabled={!isMainnetDeployed}>
              Mainnet
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div>
          <Select value={selectedTimeFrame} onChange={handleTimeFrameChange} style={{ marginRight: '8px' }}>
            <MenuItem value={30}>Last 30 days</MenuItem>
            <MenuItem value={90}>Last 90 days</MenuItem>
            <MenuItem value={0}>All time</MenuItem>
          </Select>
        </div>
      </div>

      {!selectedEnvironment && (
        <Alert severity="info" style={{ marginTop: 16 }}>
          Please select an environment to begin.
        </Alert>
      )}

      {selectedEnvironment && (isCheckContractsLoading || isLoading) && (
        <Card className={styles.card}>
          <CardContent>
            <BarChartIcon color="warning" style={{ fontSize: 60 }} />
            <Typography variant="h5" color="textSecondary" align="center">
              Analytics & Insights
            </Typography>
            <div>
              <Skeleton height={60} />
              <Skeleton height={60} />
              <Skeleton height={60} />
            </div>
          </CardContent>
        </Card>
      )}

      {selectedEnvironment && !isCheckContractsLoading && !isLoading && (
        <>
          {isDemo && (
            <Alert severity="warning" style={{ marginTop: 16 }}>
              Demo mode: The following analytics data is simulated for the purpose of demo.
            </Alert>
          )}
          {isDemo && transactions.length === 0 && (
            <Alert severity="error" style={{ marginTop: 16 }}>
              No data to display. Contract may not have been deployed.
            </Alert>
          )}
          <Card className={styles.card}>
            <CardContent>
              <div>
                <Chip label="Transactions" variant="filled" style={{ margin: 4 }} />
                <Chip label="Gas" variant="outlined" style={{ margin: 4 }} />
                <Chip label="Amount" variant="outlined" style={{ margin: 4 }} />
              </div>
              <Typography variant="h5" color="textSecondary" align="center">
                Transactions by Day
              </Typography>
              {chartData && (
                <div style={{ width: '100%', height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-75} textAnchor="middle" height={100} dy={40} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#85629a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className={styles.card}>
            <CardContent>
              <TableContainer component={Paper}>
                <Table aria-label="Analytics Table" style={{ width: '100%' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date & Time</TableCell>
                      <TableCell>Transaction</TableCell>
                      <TableCell>Block</TableCell>
                      <TableCell>Method</TableCell>
                      <TableCell>From Address</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Gas</TableCell>
                      <TableCell>Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions &&
                      transactions.map((row, index) => (
                        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell>{formatDate(row.dateTimeUTC * 1000)}</TableCell>
                          <TableCell>
                            <a href={getExplorerTxUrl(blockchain, selectedEnvironment, row.data.hash)} target="_blank">
                              {shortenHash(row.data.hash)}
                            </a>
                          </TableCell>
                          <TableCell>{row.data.blockNumber}</TableCell>
                          <TableCell>
                            <Chip label={row.data.functionName} variant="filled" />
                          </TableCell>
                          <TableCell>
                            <a
                              href={getExplorerAddressUrl(blockchain, selectedEnvironment, row.data.from)}
                              target="_blank"
                            >
                              {shortenHash(row.data.from)}
                            </a>
                          </TableCell>
                          <TableCell>{row.data.value}</TableCell>
                          <TableCell>{row.data.gasUsed}</TableCell>
                          <TableCell>
                            <IconButton>
                              <ZoomInIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
