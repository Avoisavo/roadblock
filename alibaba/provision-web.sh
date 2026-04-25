#!/bin/bash
set -e

REGION="ap-southeast-1"
ZONE="ap-southeast-1b"
INSTANCE_TYPE="ecs.t6-c1m4.large"
INSTANCE_NAME="roadblock-web"
VSWITCH_ID="vsw-t4n1gew83b1mp05dk9i1l"
SECURITY_GROUP_ID="sg-t4n5t0fcr5bz53c6tfia"
KEY_PAIR="roadblock-key"
INTERNET_BANDWIDTH=10

echo "Step 1: Using Alibaba Cloud Linux 3.2104 LTS image..."
IMAGE_ID="aliyun_3_x64_20G_alibase_20260326.vhd"
echo "ImageId: $IMAGE_ID"

echo ""
echo "Step 2: Creating ECS instance..."
RESULT=$(aliyun ecs RunInstances \
  --RegionId "$REGION" \
  --ZoneId "$ZONE" \
  --InstanceType "$INSTANCE_TYPE" \
  --ImageId "$IMAGE_ID" \
  --VSwitchId "$VSWITCH_ID" \
  --SecurityGroupId "$SECURITY_GROUP_ID" \
  --KeyPairName "$KEY_PAIR" \
  --InternetMaxBandwidthOut "$INTERNET_BANDWIDTH" \
  --InstanceChargeType PostPaid \
  --InstanceName "$INSTANCE_NAME" \
  --HostName "$INSTANCE_NAME" \
  --SystemDisk.Category cloud_essd \
  --SystemDisk.Size 40 \
  --Amount 1)

echo "RunInstances response:"
echo "$RESULT"

INSTANCE_ID=$(echo "$RESULT" | python3 -c "import sys,json; ids=json.load(sys.stdin)['InstanceIdSets']['InstanceIdSet']; print(ids[0]) if ids else print('')")

if [ -z "$INSTANCE_ID" ]; then
  echo "ERROR: Failed to parse InstanceId from response."
  exit 1
fi

echo ""
echo "Created instance: $INSTANCE_ID"
echo "Waiting 40 seconds for boot and IP assignment..."
sleep 40

echo ""
echo "Step 3: Fetching public IP..."
INFO=$(aliyun ecs DescribeInstances \
  --RegionId "$REGION" \
  --InstanceIds "[\"$INSTANCE_ID\"]")

PUBLIC_IP=$(echo "$INFO" | python3 -c "import sys,json; inst=json.load(sys.stdin)['Instances']['Instance'][0]; ips=inst['PublicIpAddress']['IpAddress']; print(ips[0]) if ips else print('not assigned yet')")
INNER_IP=$(echo "$INFO" | python3 -c "import sys,json; inst=json.load(sys.stdin)['Instances']['Instance'][0]; ips=inst['InnerIpAddress']['IpAddress']; print(ips[0]) if ips else print('n/a')")
STATUS=$(echo "$INFO" | python3 -c "import sys,json; print(json.load(sys.stdin)['Instances']['Instance'][0]['Status'])")

echo ""
echo "========================================"
echo "Instance ID: $INSTANCE_ID"
echo "Public IP:   $PUBLIC_IP"
echo "Internal IP: $INNER_IP"
echo "Status:      $STATUS"
echo "========================================"

echo ""
echo "Step 4: Opening port 3000 in security group..."
aliyun ecs AuthorizeSecurityGroup \
  --RegionId "$REGION" \
  --SecurityGroupId "$SECURITY_GROUP_ID" \
  --IpProtocol tcp \
  --PortRange 3000/3000 \
  --SourceCidrIp 0.0.0.0/0 \
  --Policy accept \
  --Priority 100 \
  && echo "Port 3000 opened." \
  || echo "Port 3000 rule may already exist, continuing."

echo ""
echo "Done. Set ALIBABA_HOST=$PUBLIC_IP in GitHub Secrets."
