/* eslint-disable */
// OBSOLETO: ya no se importa. Los íconos de la app son Lucide (docs/fidelity-iconos.md). Generado por scripts/build-icons.ts.
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';

export interface MonoIconProps {
  /** Color del ícono (relleno/trazo). */
  color?: string;
  width?: number;
  height?: number;
}

function TabsBars({ color = '#000000', width = 22.5, height = 22.5 }: MonoIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 22.5 22.5" fill="none">
      <G>
        <Path
          d="M20 0H18.75C17.3693 0 16.25 1.11929 16.25 2.5V20C16.25 21.3807 17.3693 22.5 18.75 22.5H20C21.3807 22.5 22.5 21.3807 22.5 20V2.5C22.5 1.11929 21.3807 0 20 0Z"
          fill={color}
        />
        <Path
          d="M11.875 7.5H10.625C9.24429 7.5 8.125 8.61929 8.125 10V20C8.125 21.3807 9.24429 22.5 10.625 22.5H11.875C13.2557 22.5 14.375 21.3807 14.375 20V10C14.375 8.61929 13.2557 7.5 11.875 7.5Z"
          fill={color}
        />
        <Path
          d="M3.75 16.25H2.5C1.11929 16.25 0 17.3693 0 18.75V20C0 21.3807 1.11929 22.5 2.5 22.5H3.75C5.13071 22.5 6.25 21.3807 6.25 20V18.75C6.25 17.3693 5.13071 16.25 3.75 16.25Z"
          fill={color}
        />
      </G>
    </Svg>
  );
}

function TabsLayers({ color = '#000000', width = 25.0626, height = 25.0221 }: MonoIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 25.0626 25.0221" fill="none">
      <G>
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.59221 11.661C-0.530293 10.311 -0.530293 7.21103 1.59221 5.86103L9.34221 0.928532C10.295 0.322109 11.4009 0 12.5303 0C13.6597 0 14.7657 0.322109 15.7185 0.928532L23.4697 5.86103C25.5922 7.21103 25.5922 10.311 23.4697 11.661L15.7197 16.5935C14.7669 17.2 13.661 17.5221 12.5316 17.5221C11.4022 17.5221 10.2962 17.2 9.34346 16.5935L1.59221 11.661Z"
          fill={color}
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M22.106 12.4935L15.7185 8.42853C14.7658 7.82236 13.6601 7.5004 12.531 7.5004C11.4018 7.5004 10.2961 7.82236 9.34346 8.42853L2.95596 12.4935L10.3497 17.1998C11.0016 17.6147 11.7583 17.835 12.531 17.835C13.3037 17.835 14.0603 17.6147 14.7122 17.1998L22.106 12.4935ZM23.8085 13.6048C23.7026 13.6914 23.5901 13.7727 23.471 13.8485L15.7185 18.781C14.7658 19.3872 13.6601 19.7092 12.531 19.7092C11.4018 19.7092 10.2961 19.3872 9.34346 18.781L1.59221 13.8485C1.47528 13.7736 1.36261 13.6922 1.25471 13.6048C-0.524043 15.0548 -0.411544 17.886 1.59221 19.161L9.34221 24.0935C10.295 24.7 11.4009 25.0221 12.5303 25.0221C13.6597 25.0221 14.7657 24.7 15.7185 24.0935L23.4697 19.161C25.4735 17.886 25.5872 15.0548 23.8085 13.6048Z"
          fill={color}
        />
      </G>
    </Svg>
  );
}

function TabsWallet({ color = '#000000', width = 24.375, height = 22.1856 }: MonoIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24.375 22.1856" fill="none">
      <G>
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.4375 4.06055C2.52582 4.06055 1.65148 4.42272 1.00682 5.06737C0.362164 5.71203 0 6.58637 0 7.49805V18.7481C0 19.6597 0.362164 20.5341 1.00682 21.1787C1.65148 21.8234 2.52582 22.1856 3.4375 22.1856H20.9375C21.8492 22.1856 22.7235 21.8234 23.3682 21.1787C24.0128 20.5341 24.375 19.6597 24.375 18.7481V7.49805C24.375 6.58637 24.0128 5.71203 23.3682 5.06737C22.7235 4.42272 21.8492 4.06055 20.9375 4.06055H3.4375ZM17.8125 11.5606C17.3981 11.5606 17.0007 11.7252 16.7076 12.0182C16.4146 12.3112 16.25 12.7087 16.25 13.1231C16.25 13.5375 16.4146 13.9349 16.7076 14.2279C17.0007 14.5209 17.3981 14.6856 17.8125 14.6856C18.2269 14.6856 18.6243 14.5209 18.9174 14.2279C19.2104 13.9349 19.375 13.5375 19.375 13.1231C19.375 12.7087 19.2104 12.3112 18.9174 12.0182C18.6243 11.7252 18.2269 11.5606 17.8125 11.5606Z"
          fill={color}
        />
        <Path
          d="M17.7938 0.0843045C18.1639 -0.0143224 18.5517 -0.0265922 18.9273 0.0484421C19.3029 0.123476 19.6562 0.283808 19.96 0.517063C20.2638 0.750318 20.5099 1.05026 20.6794 1.39373C20.8489 1.73721 20.9372 2.11504 20.9375 2.49805H8.4375L17.7938 0.0843045Z"
          fill={color}
        />
      </G>
    </Svg>
  );
}

function UiChevronBack({ color = '#000000', width = 9.375, height = 15.625 }: MonoIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 9.375 15.625" fill="none">
      <Path
        d="M7.8125 1.5625L1.5625 7.8125L7.8125 14.0625"
        stroke={color}
        strokeWidth="3.125"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function UiChevronRow({ color = '#000000', width = 7.5, height = 12.5 }: MonoIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 7.5 12.5" fill="none">
      <Path
        d="M6.25 1.25L1.25 6.25L6.25 11.25"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function UiCircleBg50({ color = '#000000', width = 50, height = 50 }: MonoIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 50 50" fill="none">
      <Path
        d="M0 25C0 11.1929 11.1929 0 25 0C38.8071 0 50 11.1929 50 25C50 38.8071 38.8071 50 25 50C11.1929 50 0 38.8071 0 25Z"
        fill={color}
        fillOpacity="0.22"
      />
    </Svg>
  );
}

function UiFilter({ color = '#000000', width = 26.25, height = 20.3118 }: MonoIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 26.25 20.3118" fill="none">
      <Path
        d="M1.875 1.875H24.375M6.875 10.1559H19.375M11.875 18.4368H14.375"
        stroke={color}
        strokeWidth="3.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function UiPlusGray({ color = '#000000', width = 18.75, height = 18.75 }: MonoIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 18.75 18.75" fill="none">
      <Path
        d="M1.875 9.375H9.375M9.375 9.375H16.875M9.375 9.375V1.875M9.375 9.375V16.875"
        stroke={color}
        strokeWidth="3.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function UiPlus({ color = '#000000', width = 18.75, height = 18.75 }: MonoIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 18.75 18.75" fill="none">
      <Path
        d="M1.875 9.375H9.375M9.375 9.375H16.875M9.375 9.375V1.875M9.375 9.375V16.875"
        stroke={color}
        strokeWidth="3.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function UiSearch({ color = '#000000', width = 21.875, height = 21.875 }: MonoIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 21.875 21.875" fill="none">
      <Path
        d="M16.1458 16.1458L20.3125 20.3125M1.5625 9.89583C1.5625 12.106 2.44047 14.2256 4.00328 15.7884C5.56608 17.3512 7.6857 18.2292 9.89583 18.2292C12.106 18.2292 14.2256 17.3512 15.7884 15.7884C17.3512 14.2256 18.2292 12.106 18.2292 9.89583C18.2292 7.6857 17.3512 5.56608 15.7884 4.00328C14.2256 2.44047 12.106 1.5625 9.89583 1.5625C7.6857 1.5625 5.56608 2.44047 4.00328 4.00328C2.44047 5.56608 1.5625 7.6857 1.5625 9.89583Z"
        stroke={color}
        strokeWidth="3.125"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function UiSeparator({ color = '#000000', width = 269, height = 1 }: MonoIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 269 1" fill="none">
      <Path d="M0.5 0.5H268.5" stroke={color} strokeOpacity="0.72" strokeLinecap="round" />
    </Svg>
  );
}

function SettingsBell({ color = '#000000', width = 18.3334, height = 19.1637 }: MonoIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 18.3334 19.1637" fill="none">
      <Path
        d="M13.8618 8.75C14.3459 13.2292 16.2501 14.5833 16.2501 14.5833H1.25009C1.25009 14.5833 3.75009 12.8058 3.75009 6.58333C3.75009 5.16917 4.27676 3.8125 5.21426 2.8125C6.15175 1.8125 7.42509 1.25 8.75009 1.25C9.03175 1.25 9.30953 1.275 9.58342 1.325M10.1918 17.0833C10.0452 17.3359 9.83496 17.5455 9.58194 17.6913C9.32893 17.837 9.04207 17.9137 8.75009 17.9137C8.45811 17.9137 8.17125 17.837 7.91823 17.6913C7.66522 17.5455 7.45493 17.3359 7.30842 17.0833M14.5834 6.25C15.2465 6.25 15.8823 5.98661 16.3512 5.51777C16.82 5.04893 17.0834 4.41304 17.0834 3.75C17.0834 3.08696 16.82 2.45107 16.3512 1.98223C15.8823 1.51339 15.2465 1.25 14.5834 1.25C13.9204 1.25 13.2845 1.51339 12.8157 1.98223C12.3468 2.45107 12.0834 3.08696 12.0834 3.75C12.0834 4.41304 12.3468 5.04893 12.8157 5.51777C13.2845 5.98661 13.9204 6.25 14.5834 6.25Z"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SettingsCard({ color = '#000000', width = 19.1667, height = 14.1667 }: MonoIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 19.1667 14.1667" fill="none">
      <Path
        d="M17.9167 4.58333V11.25C17.9167 11.692 17.7411 12.116 17.4285 12.4285C17.1159 12.7411 16.692 12.9167 16.25 12.9167H2.91667C2.47464 12.9167 2.05072 12.7411 1.73816 12.4285C1.42559 12.116 1.25 11.692 1.25 11.25V2.91667C1.25 2.47464 1.42559 2.05072 1.73816 1.73816C2.05072 1.42559 2.47464 1.25 2.91667 1.25H16.25C16.692 1.25 17.1159 1.42559 17.4285 1.73816C17.7411 2.05072 17.9167 2.47464 17.9167 2.91667V4.58333ZM17.9167 4.58333H4.58333"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SettingsGlobe({ color = '#000000', width = 19.1667, height = 19.1667 }: MonoIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 19.1667 19.1667" fill="none">
      <G>
        <Path
          d="M1.25 9.58333C1.25 14.1858 4.98083 17.9167 9.58333 17.9167C14.1858 17.9167 17.9167 14.1858 17.9167 9.58333C17.9167 4.98083 14.1858 1.25 9.58333 1.25C4.98083 1.25 1.25 4.98083 1.25 9.58333Z"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M10.4167 1.29167C10.4167 1.29167 12.9167 4.58333 12.9167 9.58333C12.9167 14.5833 10.4167 17.875 10.4167 17.875M8.75 17.875C8.75 17.875 6.25 14.5833 6.25 9.58333C6.25 4.58333 8.75 1.29167 8.75 1.29167M1.775 12.5H17.3917M1.775 6.66667H17.3917"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
}

function SettingsGoal({ color = '#000000', width = 18.3334, height = 20 }: MonoIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 18.3334 20" fill="none">
      <Path
        d="M6.25004 10H13.75M6.25004 10L4.58337 8.33333H1.25004L2.9167 10L1.25004 11.6667H4.58337L6.25004 10ZM12.0834 11.6667L13.75 10L12.0834 8.33333M12.9167 18.75C15.2175 18.75 17.0834 14.8325 17.0834 10C17.0834 5.1675 15.2175 1.25 12.9167 1.25C10.6159 1.25 8.75004 5.1675 8.75004 10C8.75004 14.8325 10.6159 18.75 12.9167 18.75Z"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SettingsHelp({ color = '#000000', width = 19.1667, height = 19.1667 }: MonoIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 19.1667 19.1667" fill="none">
      <G>
        <Path
          d="M9.58333 17.9167C14.1858 17.9167 17.9167 14.1858 17.9167 9.58333C17.9167 4.98083 14.1858 1.25 9.58333 1.25C4.98083 1.25 1.25 4.98083 1.25 9.58333C1.25 14.1858 4.98083 17.9167 9.58333 17.9167Z"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M7.08333 7.08333C7.08333 4.16667 11.6667 4.16667 11.6667 7.08333C11.6667 9.16667 9.58333 8.75 9.58333 11.25M9.58333 14.5917L9.59167 14.5825"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
}

function SettingsIconBg({ color = '#000000', width = 50, height = 50 }: MonoIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 50 50" fill="none">
      <Path
        d="M0 10C0 4.47715 4.47715 0 10 0H40C45.5228 0 50 4.47715 50 10V40C50 45.5228 45.5228 50 40 50H10C4.47715 50 0 45.5228 0 40V10Z"
        fill={color}
        fillOpacity="0.22"
      />
    </Svg>
  );
}

function SettingsKey({ color = '#000000', width = 19.5833, height = 9.58333 }: MonoIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 19.5833 9.58333" fill="none">
      <Path
        d="M11.4583 4.79167C11.4583 5.67572 11.8095 6.52357 12.4346 7.14869C13.0598 7.77381 13.9076 8.125 14.7917 8.125C15.6757 8.125 16.5236 7.77381 17.1487 7.14869C17.7738 6.52357 18.125 5.67572 18.125 4.79167C18.125 3.90761 17.7738 3.05977 17.1487 2.43464C16.5236 1.80952 15.6757 1.45833 14.7917 1.45833C13.9076 1.45833 13.0598 1.80952 12.4346 2.43464C11.8095 3.05977 11.4583 3.90761 11.4583 4.79167ZM11.4583 4.79167H1.45833V7.29167M4.79167 4.79167V7.29167"
        stroke={color}
        strokeWidth="2.91667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SettingsLimit({ color = '#000000', width = 17.5, height = 14.1667 }: MonoIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 17.5 14.1667" fill="none">
      <Path
        d="M11.25 12.9167H6.25M11.25 12.9167V4.25C11.25 4.11739 11.1973 3.99021 11.1036 3.89645C11.0098 3.80268 10.8826 3.75 10.75 3.75H6.75C6.61739 3.75 6.49021 3.80268 6.39645 3.89645C6.30268 3.99021 6.25 4.11739 6.25 4.25V12.9167M11.25 12.9167H15.75C15.8826 12.9167 16.0098 12.864 16.1036 12.7702C16.1973 12.6765 16.25 12.5493 16.25 12.4167V9.66667C16.25 9.53406 16.1973 9.40688 16.1036 9.31311C16.0098 9.21934 15.8826 9.16667 15.75 9.16667H11.75C11.6174 9.16667 11.4902 9.21934 11.3964 9.31311C11.3027 9.40688 11.25 9.53406 11.25 9.66667V12.9167ZM6.25 12.9167V8C6.25 7.86739 6.19732 7.74021 6.10355 7.64645C6.00979 7.55268 5.88261 7.5 5.75 7.5H1.75C1.61739 7.5 1.49021 7.55268 1.39645 7.64645C1.30268 7.74021 1.25 7.86739 1.25 8V12.4167C1.25 12.5493 1.30268 12.6765 1.39645 12.7702C1.49021 12.864 1.61739 12.9167 1.75 12.9167H6.25ZM11.25 1.25H6.25"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SettingsLock({ color = '#000000', width = 15.625, height = 19.7917 }: MonoIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 15.625 19.7917" fill="none">
      <Path
        d="M11.9792 9.89583H13.4375C13.6033 9.89583 13.7622 9.96168 13.8794 10.0789C13.9967 10.1961 14.0625 10.3551 14.0625 10.5208V17.6042C14.0625 17.7699 13.9967 17.9289 13.8794 18.0461C13.7622 18.1633 13.6033 18.2292 13.4375 18.2292H2.1875C2.02174 18.2292 1.86277 18.1633 1.74556 18.0461C1.62835 17.9289 1.5625 17.7699 1.5625 17.6042V10.5208C1.5625 10.3551 1.62835 10.1961 1.74556 10.0789C1.86277 9.96168 2.02174 9.89583 2.1875 9.89583H3.64583M11.9792 9.89583V5.72917C11.9792 4.34062 11.1458 1.5625 7.8125 1.5625C4.47917 1.5625 3.64583 4.34062 3.64583 5.72917V9.89583M11.9792 9.89583H3.64583"
        stroke={color}
        strokeWidth="3.125"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SettingsMail({ color = '#000000', width = 19.1667, height = 14.1667 }: MonoIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 19.1667 14.1667" fill="none">
      <G>
        <Path
          d="M5.41667 4.58333L9.58333 7.5L13.75 4.58333"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M1.25 11.25V2.91667C1.25 2.47464 1.42559 2.05072 1.73816 1.73816C2.05072 1.42559 2.47464 1.25 2.91667 1.25H16.25C16.692 1.25 17.1159 1.42559 17.4285 1.73816C17.7411 2.05072 17.9167 2.47464 17.9167 2.91667V11.25C17.9167 11.692 17.7411 12.116 17.4285 12.4285C17.1159 12.7411 16.692 12.9167 16.25 12.9167H2.91667C2.47464 12.9167 2.05072 12.7411 1.73816 12.4285C1.42559 12.116 1.25 11.692 1.25 11.25Z"
          stroke={color}
          strokeWidth="2.5"
        />
      </G>
    </Svg>
  );
}

function SettingsMoon({ color = '#000000', width = 17.9167, height = 17.9218 }: MonoIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 17.9167 17.9218" fill="none">
      <Path
        d="M3.16827 13.4649C2.05981 12.0656 1.45718 10.3326 1.45833 8.5475C1.45757 7.0737 1.86866 5.629 2.64523 4.37639C3.4218 3.12377 4.53295 2.11308 5.85333 1.45833C5.85333 8.54667 9.36917 12.0633 16.4583 12.0633C15.6661 13.663 14.3562 14.9478 12.7414 15.7087C11.1266 16.4697 9.30189 16.6621 7.56388 16.2547C5.82588 15.8474 4.27674 14.8641 3.16827 13.4649Z"
        stroke={color}
        strokeWidth="2.91667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SettingsNote({ color = '#000000', width = 17.7074, height = 19.0606 }: MonoIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 17.7074 19.0606" fill="none">
      <G>
        <Path
          d="M1.27535 14.117L3.30119 2.62782C3.33913 2.41221 3.41917 2.2062 3.53675 2.02153C3.65432 1.83687 3.80712 1.67718 3.98643 1.55158C4.16573 1.42599 4.36802 1.33694 4.58174 1.28954C4.79546 1.24214 5.01643 1.2373 5.23202 1.27532L15.0804 3.01282C15.5156 3.08963 15.9026 3.33621 16.1561 3.69831C16.4095 4.06041 16.5088 4.50836 16.432 4.94365L14.4062 16.4328C14.3682 16.6484 14.2882 16.8544 14.1706 17.0391C14.0531 17.2238 13.9002 17.3834 13.7209 17.509C13.5416 17.6346 13.3394 17.7237 13.1256 17.7711C12.9119 17.8185 12.6909 17.8233 12.4754 17.7853L2.62702 16.0478C2.19174 15.971 1.8048 15.7244 1.55132 15.3623C1.29784 15.0002 1.19857 14.5523 1.27535 14.117Z"
          stroke={color}
          strokeWidth="2.5"
        />
        <Path
          d="M6.29452 4.84782L12.8604 6.00532M5.71535 8.13032L12.2812 9.28865M5.13702 11.4128L9.24035 12.137"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
}

function SettingsPerson({ color = '#000000', width = 14.1667, height = 15.8333 }: MonoIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 14.1667 15.8333" fill="none">
      <Path
        d="M1.25 14.5833V13.75C1.25 12.2029 1.86458 10.7192 2.95854 9.62521C4.05251 8.53125 5.53624 7.91667 7.08333 7.91667M7.08333 7.91667C8.63043 7.91667 10.1142 8.53125 11.2081 9.62521C12.3021 10.7192 12.9167 12.2029 12.9167 13.75V14.5833M7.08333 7.91667C7.96739 7.91667 8.81523 7.56548 9.44036 6.94036C10.0655 6.31523 10.4167 5.46739 10.4167 4.58333C10.4167 3.69928 10.0655 2.85143 9.44036 2.22631C8.81523 1.60119 7.96739 1.25 7.08333 1.25C6.19928 1.25 5.35143 1.60119 4.72631 2.22631C4.10119 2.85143 3.75 3.69928 3.75 4.58333C3.75 5.46739 4.10119 6.31523 4.72631 6.94036C5.35143 7.56548 6.19928 7.91667 7.08333 7.91667Z"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SettingsWallet({ color = '#000000', width = 17.5, height = 16.1637 }: MonoIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 17.5 16.1637" fill="none">
      <G>
        <Path
          d="M14.5833 14.9137H2.91667C2.47464 14.9137 2.05072 14.7381 1.73816 14.4255C1.42559 14.113 1.25 13.6891 1.25 13.247V5.74704C1.25 5.30501 1.42559 4.88109 1.73816 4.56852C2.05072 4.25596 2.47464 4.08037 2.91667 4.08037H14.5833C15.0254 4.08037 15.4493 4.25596 15.7618 4.56852C16.0744 4.88109 16.25 5.30501 16.25 5.74704V13.247C16.25 13.6891 16.0744 14.113 15.7618 14.4255C15.4493 14.7381 15.0254 14.9137 14.5833 14.9137Z"
          stroke={color}
          strokeWidth="2.5"
        />
        <Path
          d="M12.5 9.9137C12.3895 9.9137 12.2835 9.8698 12.2054 9.79166C12.1272 9.71352 12.0833 9.60754 12.0833 9.49704C12.0833 9.38653 12.1272 9.28055 12.2054 9.20241C12.2835 9.12427 12.3895 9.08037 12.5 9.08037C12.6105 9.08037 12.7165 9.12427 12.7946 9.20241C12.8728 9.28055 12.9167 9.38653 12.9167 9.49704C12.9167 9.60754 12.8728 9.71352 12.7946 9.79166C12.7165 9.8698 12.6105 9.9137 12.5 9.9137Z"
          fill={color}
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M13.75 4.08037V2.9162C13.7499 2.66079 13.6912 2.40881 13.5782 2.17972C13.4653 1.95063 13.3012 1.75056 13.0987 1.59496C12.8961 1.43937 12.6605 1.3324 12.41 1.28234C12.1596 1.23227 11.901 1.24043 11.6542 1.3062L2.4875 3.75037C2.13254 3.84496 1.81878 4.05417 1.59499 4.34547C1.3712 4.63678 1.24992 4.99386 1.25 5.3612V5.74704"
          stroke={color}
          strokeWidth="2.5"
        />
      </G>
    </Svg>
  );
}

export const monoIcons = {
  'tabs/bars': TabsBars,
  'tabs/layers': TabsLayers,
  'tabs/wallet': TabsWallet,
  'ui/chevron-back': UiChevronBack,
  'ui/chevron-row': UiChevronRow,
  'ui/circle-bg-50': UiCircleBg50,
  'ui/filter': UiFilter,
  'ui/plus-gray': UiPlusGray,
  'ui/plus': UiPlus,
  'ui/search': UiSearch,
  'ui/separator': UiSeparator,
  'settings/bell': SettingsBell,
  'settings/card': SettingsCard,
  'settings/globe': SettingsGlobe,
  'settings/goal': SettingsGoal,
  'settings/help': SettingsHelp,
  'settings/icon-bg': SettingsIconBg,
  'settings/key': SettingsKey,
  'settings/limit': SettingsLimit,
  'settings/lock': SettingsLock,
  'settings/mail': SettingsMail,
  'settings/moon': SettingsMoon,
  'settings/note': SettingsNote,
  'settings/person': SettingsPerson,
  'settings/wallet': SettingsWallet,
} as const;

/** Tamaño natural (ancho, alto) de cada ícono, en puntos, tal como sale de Figma. */
export const monoIconSizes: Record<keyof typeof monoIcons, readonly [number, number]> = {
  'tabs/bars': [22.5, 22.5],
  'tabs/layers': [25.0626, 25.0221],
  'tabs/wallet': [24.375, 22.1856],
  'ui/chevron-back': [9.375, 15.625],
  'ui/chevron-row': [7.5, 12.5],
  'ui/circle-bg-50': [50, 50],
  'ui/filter': [26.25, 20.3118],
  'ui/plus-gray': [18.75, 18.75],
  'ui/plus': [18.75, 18.75],
  'ui/search': [21.875, 21.875],
  'ui/separator': [269, 1],
  'settings/bell': [18.3334, 19.1637],
  'settings/card': [19.1667, 14.1667],
  'settings/globe': [19.1667, 19.1667],
  'settings/goal': [18.3334, 20],
  'settings/help': [19.1667, 19.1667],
  'settings/icon-bg': [50, 50],
  'settings/key': [19.5833, 9.58333],
  'settings/limit': [17.5, 14.1667],
  'settings/lock': [15.625, 19.7917],
  'settings/mail': [19.1667, 14.1667],
  'settings/moon': [17.9167, 17.9218],
  'settings/note': [17.7074, 19.0606],
  'settings/person': [14.1667, 15.8333],
  'settings/wallet': [17.5, 16.1637],
};

export type MonoIconName = keyof typeof monoIcons;
