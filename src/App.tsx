import {
  ChakraProvider,
  extendTheme,
  ThemeConfig,
  Box,
  Flex,
} from '@chakra-ui/react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom'
import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'
import './app.css';
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import Challenge from "./pages/Challenge";
import Home from "./pages/Home"
import NotFound from "./pages/NotFound";


const colors = {
  // brand: {
  //   900: '#1a365d',
  //   800: '#153e75',
  //   700: '#2a69ac',
  // }
}

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const Border = {
  variants: {
    'thin': (props: any) => ({
      border: '1px solid',
      borderColor: props.colorMode === 'light' ? 'gray.200' : 'whiteAlpha.300',
      borderRadius: '8px',
    }),
    'thick': (props: any) => ({
      border: '4px solid',
      borderColor: props.colorMode === 'light' ? 'gray.200' : 'whiteAlpha.300',
      borderRadius: '8px',
    }),
  },
  // The default variant value
  defaultProps: {
    variant: 'thin',
  },
}

const components = {
  Border,
}

const theme = extendTheme({ config, colors, components })


export const App = () => (
  <ChakraProvider theme={theme}>
    <Router basename="/open-work" >
      <Box p={3}>
        <Flex justify="end">
          <ColorModeSwitcher />
        </Flex>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/challenge" element={<Challenge/>}/>
          {/* <Route path="/recovery-password" element={<RecoveryPassword/>}/> */}
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </Box>
    </Router>
  </ChakraProvider>
)