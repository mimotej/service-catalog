import { ConfigApi } from "@backstage/core-plugin-api";
import { ClusterDetails } from "@internal/backstage-plugin-rhacm-common";


const clusterApiFetchCall = (
  configApi: ConfigApi,
  params: string
): Promise<any> => {
  const backendUrl = configApi.getString('backend.baseUrl');
  const jsonResponse = fetch(`${backendUrl}/api/rhacm/status${params}`)
    .then(r => r.json())
  return jsonResponse;
}

export const getClusters = async (
  configApi: ConfigApi
): Promise<ClusterDetails[]> => (
  clusterApiFetchCall(configApi, '')
)

export const getClusterByName = async (
  configApi: ConfigApi,
  name: string
): Promise<ClusterDetails> => (
  clusterApiFetchCall(configApi, `/${name}`)
)