#!/usr/bin/env python3
"""
System Monitor Script
Reads system metrics from /proc filesystem and outputs JSON
"""
import json
import time
import os

def get_cpu_usage():
    """Calculate CPU usage percentage from /proc/stat"""
    try:
        with open('/proc/stat', 'r') as f:
            line = f.readline()
            # Format: cpu user nice system idle iowait irq softirq
            fields = line.split()
            if fields[0] != 'cpu':
                return 0.0
            
            # Get all CPU time values
            user = int(fields[1])
            nice = int(fields[2])
            system = int(fields[3])
            idle = int(fields[4])
            iowait = int(fields[5]) if len(fields) > 5 else 0
            irq = int(fields[6]) if len(fields) > 6 else 0
            softirq = int(fields[7]) if len(fields) > 7 else 0
            
            # Calculate total and idle time
            total = user + nice + system + idle + iowait + irq + softirq
            idle_time = idle + iowait
            
            # Read again after a short delay to calculate usage
            time.sleep(0.1)
            
            with open('/proc/stat', 'r') as f2:
                line2 = f2.readline()
                fields2 = line2.split()
                
                user2 = int(fields2[1])
                nice2 = int(fields2[2])
                system2 = int(fields2[3])
                idle2 = int(fields2[4])
                iowait2 = int(fields2[5]) if len(fields2) > 5 else 0
                irq2 = int(fields2[6]) if len(fields2) > 6 else 0
                softirq2 = int(fields2[7]) if len(fields2) > 7 else 0
                
                total2 = user2 + nice2 + system2 + idle2 + iowait2 + irq2 + softirq2
                idle_time2 = idle2 + iowait2
                
                # Calculate differences
                total_diff = total2 - total
                idle_diff = idle_time2 - idle_time
                
                # Calculate CPU usage percentage
                if total_diff > 0:
                    cpu_usage = ((total_diff - idle_diff) / total_diff) * 100
                    return round(cpu_usage, 2)
                else:
                    return 0.0
    except Exception as e:
        return 0.0

def get_memory_info():
    """Read memory information from /proc/meminfo"""
    try:
        mem_info = {}
        with open('/proc/meminfo', 'r') as f:
            for line in f:
                parts = line.split(':')
                if len(parts) == 2:
                    key = parts[0].strip()
                    value = parts[1].strip().split()[0]  # Get the number, ignore 'kB'
                    mem_info[key] = int(value)
        
        # Calculate memory in Bytes (input is in kB)
        total_bytes = mem_info.get('MemTotal', 0) * 1024
        available_bytes = mem_info.get('MemAvailable', 0) * 1024
        used_bytes = total_bytes - available_bytes
        
        return {
            'ram_total': total_bytes,
            'ram_used': used_bytes,
            'ram_free': available_bytes
        }
    except Exception as e:
        return {
            'ram_total': 0,
            'ram_used': 0,
            'ram_free': 0
        }

def get_uptime():
    """Read system uptime from /proc/uptime"""
    try:
        with open('/proc/uptime', 'r') as f:
            uptime_seconds = float(f.read().split()[0])
            return int(uptime_seconds)
    except Exception as e:
        return 0

def get_os_info():
    """Read OS information from /etc/os-release"""
    try:
        os_info = {}
        with open('/etc/os-release', 'r') as f:
            for line in f:
                if '=' in line:
                    key, value = line.strip().split('=', 1)
                    # Remove quotes from value
                    os_info[key] = value.strip('"')
        
        return {
            'os_name': os_info.get('NAME', 'Unknown'),
            'os_version': os_info.get('VERSION_ID', 'Unknown'),
            'os_pretty_name': os_info.get('PRETTY_NAME', 'Unknown')
        }
    except Exception as e:
        return {
            'os_name': 'Unknown',
            'os_version': 'Unknown',
            'os_pretty_name': 'Unknown'
        }

def main():
    """Main function to gather all system metrics and output JSON"""
    try:
        # Gather all metrics
        cpu_usage = get_cpu_usage()
        memory = get_memory_info()
        uptime = get_uptime()
        os_info = get_os_info()
        
        # Combine all data
        system_data = {
            'cpu': cpu_usage,
            'ram_total': memory['ram_total'],
            'ram_used': memory['ram_used'],
            'ram_free': memory['ram_free'],
            'uptime': uptime,
            'os_name': os_info['os_name'],
            'os_version': os_info['os_version'],
            'os_pretty_name': os_info['os_pretty_name'],
            'timestamp': int(time.time())
        }
        
        # Output as JSON
        print(json.dumps(system_data))
        
    except Exception as e:
        # Output error as JSON
        error_data = {
            'error': str(e),
            'cpu': 0,
            'ram_total': 0,
            'ram_used': 0,
            'ram_free': 0,
            'uptime': 0,
            'os_name': 'Error',
            'os_version': 'Error',
            'os_pretty_name': 'Error',
            'timestamp': int(time.time())
        }
        print(json.dumps(error_data))

if __name__ == '__main__':
    main()
