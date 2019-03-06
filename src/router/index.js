import JurisdictionOverview from './JurisdictionOverview';
import VideoSurveillance from './VideoSurveillance';
import HumanIntelligence from './HumanIntelligence';
import NetworkAlarm from './NetworkAlarm';
import PersonnelControl from './PersonnelControl';
import VehicleControl from './VehicleControl';
import EventControl from './EventControl';
import Baselib from './Baselib';
import CommunityManagement from './CommunityManagement';
import PersonnelAnalysis from './PersonnelAnalysis';
import VehicleAnalysis from './VehicleAnalysis';
import EventAnalysis from './EventAnalysis';
import TrajectoryAnalysis from './TrajectoryAnalysis';
import IntelligentOrdering from './IntelligentOrdering';
import IntelligentJudgment from './IntelligentJudgment';
import MyWorkbench from './MyWorkbench';
import SystemManagement from './SystemManagement';
import Details from './Details';
import Download from './Download'
import SystemTools from './SystemTools'

export default [].concat(
  JurisdictionOverview,
  VideoSurveillance,
  HumanIntelligence,
  NetworkAlarm,
  PersonnelControl,
  VehicleControl,
  EventControl,
  Baselib,
  CommunityManagement,
  PersonnelAnalysis,
  VehicleAnalysis,
  EventAnalysis,
  TrajectoryAnalysis,
  IntelligentOrdering,
  IntelligentJudgment,
  MyWorkbench,
  SystemManagement,
  Details,
  SystemTools,
  Download,
  process.env.NODE_ENV !== 'production' ? require('./Technology').default : []
);